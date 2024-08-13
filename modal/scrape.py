import re
from bs4 import BeautifulSoup
import os
import modal
from modal import Stub, web_endpoint
from typing import Dict
import requests
from PIL import Image
from io import BytesIO
from urllib.parse import urlparse
from playwright.async_api import async_playwright, Error as PlaywrightError
from markdownify import markdownify as md

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
    try:
        cur_url = request.get('url')
        key = request.get('secret_key')
        secret_key = os.environ.get('secret_key')
        
        if key != secret_key:
            raise ValueError("Invalid secret key")
        if not cur_url:
            raise ValueError("URL is missing in the request")

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            try:
                await page.goto(cur_url, timeout=30000)
                await page.wait_for_timeout(2000)

                links = await page.eval_on_selector_all("a[href]", """
                    (baseUrl) => {
                        const uniqueLinks = new Set();
                        const base = new URL(baseUrl);
                        const normalizedBase = base.origin + base.pathname.replace(/\/+$/, '');

                        for (const element of document.querySelectorAll('a[href]')) {
                            let href = element.href;

                            if ((href.startsWith('http://') || href.startsWith('https://')) && href !== base.href) {
                                href = href.split(/[?#]/)[0];
                                const normalizedHref = href.replace(/\/+$/, '');

                                if (normalizedHref !== normalizedBase && ((normalizedHref + '/') !== normalizedBase)) {
                                    uniqueLinks.add(normalizedHref);
                                }
                            }
                        }

                        return Array.from(uniqueLinks);
                    }
                """, cur_url)

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

                valid_images = []
                seen_alts = set()

                for img in images:
                    if img['alt'] not in seen_alts and is_valid_image(img['src']):
                        valid_images.append(img)
                        seen_alts.add(img['alt'])
                    if len(valid_images) >= 10:  # Limit to 10 images
                        break

                html_content = await page.content()
                soup = BeautifulSoup(html_content, 'html.parser')

                exclude_tags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'nav', 'aside', 'footer', 'button', 'svg', 'form', 'textarea', 'select', 'a']
                exclude_classes = ['nav', 'navbar', 'header', 'footer', 'sidebar', 'menu']
                exclude_ids = ['footer', 'sidebar', 'menu', 'button', 'navbar', 'nav']

                for tag in exclude_tags:
                    for element in soup.find_all(tag):
                        element.decompose()

                for class_name in exclude_classes:
                    for element in soup.find_all(class_=class_name):
                        element.decompose()

                for id in exclude_ids:
                    for element in soup.find_all(attrs={'id': id}):
                        element.decompose()

                # Keep track of placeholders for tables and code blocks
                table_placeholders = []
                code_placeholders = []

                for table in soup.find_all("table"):
                    placeholder = "<#t#>"
                    table_placeholders.append((placeholder, str(table)))
                    table.replace_with(placeholder)

                for pre_tag in soup.find_all("pre"):
                    placeholder = "<#p#>"
                    code_placeholders.append((placeholder, str(pre_tag)))
                    pre_tag.replace_with(placeholder)

                for code_tag in soup.find_all("code"):
                    placeholder = "<#c#>"
                    code_placeholders.append((placeholder, str(code_tag)))
                    code_tag.replace_with(placeholder)

                try:
                    title = await page.title()
                except PlaywrightError:
                    parsed_url = urlparse(cur_url)
                    title = parsed_url.netloc

                # Extract text with spaces between tag contents
                readable_text = soup.get_text(separator=' ').lower().replace('\n' , ' ').strip()
                readable_text = re.sub(r'[^\x00-\x7F]', '', readable_text)

                # Replace placeholders with corresponding markdown content
                for placeholder, original_html in table_placeholders:
                    markdown_table = md(original_html)
                    readable_text = readable_text.replace(placeholder, markdown_table, 1)
                
                for placeholder, original_html in code_placeholders:
                    markdown_code = md(original_html)
                    readable_text = readable_text.replace(placeholder, markdown_code, 1)

                markdown_output = readable_text

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}

            finally:
                await browser.close()

        return {
            "data": [{
                "url": cur_url,
                "title": title,
                "content": markdown_output,
                "images": {"data": valid_images}
            }],
            "links": links,
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}
