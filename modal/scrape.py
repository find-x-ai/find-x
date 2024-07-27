import os
import modal
from modal import App, web_endpoint
from typing import Dict
from markdownify import MarkdownConverter
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse, urljoin

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
    "pip install markdownify beautifulsoup4"
)

stub = App(name="link-scraper", image=playwright_image)

class CustomMarkdownConverter(MarkdownConverter):
    def __init__(self, base_url=None, **options):
        super().__init__(**options)
        self.base_url = base_url

    def convert_a(self, el, text, convert_as_inline):
        return text

    def convert_img(self, el, text, convert_as_inline):
        src = el.get('src')
        if src and self.base_url:
            src = urljoin(self.base_url, src)
        alt = el.get('alt', '')
        return f'![{alt}]({src})'

    def convert_p(self, el, text, convert_as_inline):
        return super().convert_p(el, text, convert_as_inline).strip() + '\n\n'

def md(html, base_url=None, **options):
    return CustomMarkdownConverter(base_url=base_url, **options).convert(html)

def clean_markdown(markdown_text):
    # Remove excessive newlines
    cleaned = re.sub(r'\n{3,}', '\n\n', markdown_text)
    
    # Remove backslashes before special characters
    cleaned = re.sub(r'\\([`*_{}[\]()#+\-.!])', r'\1', cleaned)
    
    # Replace escaped newlines with actual newlines
    cleaned = re.sub(r'\\n+', '\n', cleaned)
    
    # Remove backslashes before pipes
    cleaned = re.sub(r'\\\|', '|', cleaned)
    
    # Remove excessive whitespace around headings
    cleaned = re.sub(r'\n\s*(#+)', r'\n\1', cleaned)
    
    # Ensure proper spacing around headings
    cleaned = re.sub(r'(#+[^\n]*)\n+', r'\1\n', cleaned)
    
    # Ensure proper spacing after headers
    cleaned = re.sub(r'(#{1,6})\s+', r'\1 ', cleaned)
    
    # Fix inconsistent list formatting
    cleaned = re.sub(r'(?<!^)\s*([*+-]\s+)', r'\1', cleaned)
    
    # Remove extra spaces before list bullets
    cleaned = re.sub(r'\s+([-*+]\s+)', r'\1', cleaned)
    
    # Ensure double newlines after paragraphs
    cleaned = re.sub(r'([^\n])\n([^\n#*])', r'\1\n\n\2', cleaned)
    
    # Remove extra newlines around code blocks
    cleaned = re.sub(r'```(\n+)([^`]*?)(\n+```)', r'```\2```', cleaned)

    # Remove extra spaces at the beginning and end
    cleaned = cleaned.strip()
    
    return cleaned

@stub.function(secrets=[modal.Secret.from_name("secret_key")])
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright, Error as PlaywrightError
    
    try:
        async with async_playwright() as p:
            cur_url = request.get('url')
            key = request.get('secret_key')
            secret_key = os.environ["secret_key"]
            if key != secret_key:
                raise ValueError("Invalid secret key")
            if not cur_url:
                raise ValueError("URL is missing in the request")

            browser = await p.chromium.launch()
            try:
                page = await browser.new_page()
                await page.goto(cur_url, timeout=30000)
                await page.wait_for_timeout(2000)
                
                # Extract links
                links = await page.eval_on_selector_all("a[href]", """
                    (baseUrl) => {
                        const uniqueLinks = new Set();
                        const base = new URL(baseUrl);

                        for (const element of document.querySelectorAll('a[href]')) {
                            const href = element.href;

                            if ((href.startsWith('http://') || href.startsWith('https://')) && href !== base.href) {
                                const normalizedHref = href.split('#')[0].replace(/\/+$/, '').toLowerCase();
                                uniqueLinks.add(normalizedHref);
                            }
                        }

                        return Array.from(uniqueLinks);
                    }
                """, cur_url)

                unique_links = list(links)

                # Extract image URLs and alt text
                images = await page.eval_on_selector_all("img[src]", """
                    () => {
                        const images = [];
                        for (const element of document.querySelectorAll('img[src]')) {
                            const src = element.src;
                            if (src.startsWith('http://') || src.startsWith('https://')) {
                                images.push({
                                    url: src,
                                    alt: element.alt || 'No description available'
                                });
                            }
                        }
                        return images;
                    }
                """)

                # Get HTML content
                html_content = await page.content()

                # Parse HTML and remove excluded elements
                soup = BeautifulSoup(html_content, 'html.parser')
                exclude_tags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'nav', 'aside', 'footer', 'button', 'svg', 'form', 'textarea', 'select']
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

                # Convert cleaned HTML to Markdown
                cleaned_html = str(soup)
                parsed_url = urlparse(cur_url)
                domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
                markdown_content = md(cleaned_html, base_url=domain, heading_style="ATX", bullets="-")
                
                # Clean up the Markdown
                markdown_content = clean_markdown(markdown_content)

                # Strip all '\n' characters from the content
                markdown_content = markdown_content.replace('\n', '')

                if len(markdown_content) < 20:
                    raise ValueError("Insufficient content found on the page")
                    
                data = {cur_url: markdown_content}

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}
            
            finally:
                await browser.close()

        return {
            "data": [{"url": cur_url, "content": data[cur_url]}], 
            "links": unique_links, 
            "images": {"data": images}
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}