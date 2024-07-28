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

@stub.function(secrets=[modal.Secret.from_name("secret_key")])
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright, Error as PlaywrightError
    from markdownify import markdownify as md
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

                # Extract image URLs and alt text
                images = await page.eval_on_selector_all("img[src]", """
                    () => {
                        const images = [];
                        for (const element of document.querySelectorAll('img[src]')) {
                            const src = element.src;
                            if(images.length < 10){
                              if (src.startsWith('http://') || src.startsWith('https://')) {
                                images.push({
                                    src: src,
                                    alt: element.alt || 'No description available'
                                });
                              }  
                                
                            }else {
                                break;
                            }
                            
                        }
                        return images;
                    }
                """)

                # Get HTML content
                html_content = await page.content()

                # Parse HTML and remove excluded elements
                soup = BeautifulSoup(html_content, 'html.parser')
                exclude_tags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'nav', 'aside', 'footer', 'button', 'svg', 'form', 'textarea', 'select' , 'a' ,]
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
                cleaned_html = str(soup.body)
                cleaned_html = re.sub(r'\d+', '', cleaned_html)  # Remove sequences of digits
                cleaned_html = re.sub(r'\s+', ' ', cleaned_html).strip()  # Remove extra whitespace
                
                parsed_url = urlparse(cur_url)
                domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
                markdown_content = md(cleaned_html, base_url=domain, heading_style="ATX", bullets="-")
                markdown_content = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', markdown_content)
                
                data = {cur_url: markdown_content}

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}
            
            finally:
                await browser.close()

        return {
            "data": [{"url": cur_url, "content": data[cur_url] ,  "images": {"data": images}}], 
            "links": unique_links, 
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}