import re
from bs4 import BeautifulSoup
import os
import modal
from modal import App, build, enter, method, web_endpoint
from typing import Dict
import aiohttp
from PIL import Image
from io import BytesIO
from urllib.parse import urlparse, urljoin
from playwright.async_api import async_playwright, Error as PlaywrightError
from markdownify import markdownify as md
import asyncio

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
    "pip install markdownify beautifulsoup4 pillow aiohttp"
)

app = App(name="link-scraper", image=playwright_image)

@app.function(secrets=[modal.Secret.from_name("secret_key")])
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
                await page.goto(cur_url, timeout=30000, wait_until="networkidle")

                links_task = page.eval_on_selector_all("a[href]", """
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

                images_task = page.eval_on_selector_all("img[src]", """
                    (baseUrl) => {
                        const images = [];
                        for (const element of document.querySelectorAll('img[src]')) {
                            let src = element.src;
                            if (!src.startsWith('http://') && !src.startsWith('https://')) {
                                src = new URL(src, baseUrl).href;
                            }
                            const alt = element.alt || 'No description available';
                            images.push({src, alt});
                        }
                        return images;
                    }
                """, cur_url)

                html_content_task = page.content()

                links, images, html_content = await asyncio.gather(links_task, images_task, html_content_task)

                min_width = 200
                min_height = 200

                async def is_valid_image(img_url):
                    try:
                        async with aiohttp.ClientSession() as session:
                            async with session.get(img_url) as response:
                                if response.status == 200:
                                    img = Image.open(BytesIO(await response.read()))
                                    width, height = img.size
                                    return width >= min_width and height >= min_height
                    except Exception as e:
                        print(f"Error processing image {img_url}: {e}")
                    return False

                valid_images = []
                seen_alts = set()

                image_validation_tasks = [is_valid_image(img['src']) for img in images if img['alt'] not in seen_alts]
                valid_flags = await asyncio.gather(*image_validation_tasks)

                for img, is_valid in zip(images, valid_flags):
                    if is_valid:
                        valid_images.append(img)
                        seen_alts.add(img['alt'])
                    if len(valid_images) >= 10:
                        break

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
                readable_text = soup.get_text(separator=' ').lower().replace('\n', ' ').strip()
                readable_text = re.sub(r'[^\x00-\x7F]', '', readable_text)

                # Replace placeholders with corresponding markdown content
                for placeholder, original_html in table_placeholders:
                    markdown_table = md(original_html)
                    readable_text = readable_text.replace(placeholder, markdown_table, 1)

                for placeholder, original_html in code_placeholders:
                    markdown_code = md(original_html)
                    readable_text = readable_text.replace(placeholder, markdown_code, 1)
      
                title_lower = title.lower()
                if readable_text.startswith(title_lower + ' '):
                    # Remove the duplicate title
                    markdown_output = readable_text[len(title_lower):].lstrip()
                    if markdown_output.startswith(title_lower + ' '):
                        summary_text = markdown_output[len(title_lower):].lstrip()
                    else:
                        summary_text = markdown_output
                else:
                    markdown_output = readable_text
                    summary_text = markdown_output

                def extract_text(text):
                    if '```' in text:
                        text = re.sub(r'```[\s\S]*?```', '', text)

                    if '|' in text or '-' in text:
                        text = re.sub(r'\|.*?\|', '', text)
                        text = re.sub(r'-{2,}', '', text)

                    sentences = text.split('.')

                    return '. '.join(sentences[:2]) + '.'

                summary = extract_text(summary_text)

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}
            finally:
                await browser.close()

        return {
            "data": [{
                "url": cur_url,
                "title": title,
                "content": markdown_output,
                "summary": summary,
                "images": {"data": valid_images}
            }],
            "links": links,
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}
