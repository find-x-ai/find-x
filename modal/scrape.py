import os
import modal
from modal import Stub, web_endpoint
from typing import Dict
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
from PIL import Image
import requests
from io import BytesIO

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
    "pip install markdownify beautifulsoup4 pillow requests"
)

stub = Stub(name="link-scraper", image=playwright_image)

@stub.function(secrets=[modal.Secret.from_name("secret_key")])
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright, Error as PlaywrightError
    from markdownify import markdownify as md
    try:
        async with async_playwright() as p:
            cur_url = request.get('url')
            key = request.get('secret_key')
            secret_key=os.environ['secret_key']
            if key != secret_key:
                raise ValueError("Invalid secret key")
            if not cur_url:
                raise ValueError("URL is missing in the request")

            browser = await p.chromium.launch()
            try:
                page = await browser.new_page()
                await page.goto(cur_url, timeout=30000)
                await page.wait_for_timeout(2000)
                
                # Extract title
                title = await page.title()

                # Extract links
                links = await page.eval_on_selector_all("a[href]", """
                    (baseUrl) => {
                        const uniqueLinks = new Set();
                        const base = new URL(baseUrl);

                        const normalizedBase = base.origin + base.pathname.replace(/\/+$/, '')

                        for (const element of document.querySelectorAll('a[href]')) {
                            let href = element.href;

                            if ((href.startsWith('http://') || href.startsWith('https://')) && href !== base.href) {
                                // Remove query parameters and fragments
                                href = href.split(/[?#]/)[0];
                                const normalizedHref = href.replace(/\/+$/, '')

                                if (normalizedHref !== normalizedBase && ((normalizedHref + '/') !== normalizedBase)) {
                                    uniqueLinks.add(normalizedHref);
                                }
                            }
                        }

                        return Array.from(uniqueLinks);
                    }
                """, cur_url)

                unique_links = list(links)

                # Extract image URLs and alt text with filtering
                min_width = 200
                min_height = 200

                def is_valid_image(img_url):
                    try:
                        response = requests.get(img_url)
                        img = Image.open(BytesIO(response.content))
                        width, height = img.size
                        return width >= min_width and height >= min_height
                    except Exception:
                        return False

                images = await page.eval_on_selector_all("img[src]", """
                    () => {
                        const images = [];
                        for (const element of document.querySelectorAll('img[src]')) {
                            const src = element.src;
                            const alt = element.alt || 'No description available';
                            images.push({src, alt});
                        }
                        return images;
                    }
                """)

                # Filter images by size and unique alt text
                valid_images = []
                seen_alts = set()

                for img in images:
                    if img['alt'] not in seen_alts and is_valid_image(img['src']):
                        valid_images.append(img)
                        seen_alts.add(img['alt'])
                    if len(valid_images) >= 10:  # Limit to 10 images
                        break

                # Get HTML content
                html_content = await page.content()

                # Parse HTML and remove excluded elements
                soup = BeautifulSoup(html_content, 'html.parser')
                exclude_tags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'nav', 'aside', 'footer', 'button', 'svg', 'form', 'textarea', 'select', 'a']
                exclude_classes = ['nav', 'navbar', 'header', 'footer', 'sidebar', 'menu']

                for tag in exclude_tags:
                    for element in soup.find_all(tag):
                        element.decompose()

                for class_name in exclude_classes:
                    for element in soup.find_all(class_=class_name):
                        element.decompose()

                # Remove image tags to keep only text
                for img in soup.find_all('img'):
                    img.decompose()

                parsed_url = urlparse(cur_url)
                domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
                markdown_content = md(str(soup.body), base_url=domain, heading_style="ATX", bullets="-")
                markdown_content = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', markdown_content)

                # Remove extra newlines
                markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)
                
                # Extract the title from the Markdown content
                markdown_lines = markdown_content.splitlines()
                markdown_title = None
                for line in markdown_lines:
                    if line.strip():
                        markdown_title = line.split('#', 1)[1].strip() if '#' in line else line.strip()
                        break

                if not markdown_title:
                    markdown_title = parsed_url.netloc# Fallback if no title found

                # Remove unwanted Markdown formatting except for table and code blocks
                def preserve_markdown(content):
                    in_code_block = False
                    preserved_lines = []
                    for line in content.splitlines():
                        if line.startswith("```"):
                            in_code_block = not in_code_block
                        if in_code_block or line.startswith("|"):
                            preserved_lines.append(line)
                        else:
                            preserved_lines.append(re.sub(r'\*|_|#|-|\[|\]', '', line.lower()))
                    # Join lines, strip leading/trailing spaces, and reduce multiple spaces to a single space
                    return re.sub(r'\s+', ' ', " ".join(preserved_lines)).strip()

                markdown_content = preserve_markdown(markdown_content)

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}
            
            finally:
                await browser.close()

        return {
            "data": [{
                "url": cur_url,
                "title": title,  # Use the page title
                "content": markdown_content,  # Use the content with simplified Markdown
                "images": {"data": valid_images}
            }],
            "links": unique_links,
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}