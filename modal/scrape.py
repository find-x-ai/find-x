import os
import modal
from modal import Stub, web_endpoint
from typing import Dict

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
)

stub = Stub(name="link-scraper", image=playwright_image)

@stub.function(secrets=[modal.Secret.from_name("secret_key")])
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright, Error as PlaywrightError
    
    try:
        async with async_playwright() as p:
            cur_url = request.get('url')
            key = request.get('secret_key')
            secret_key = os.environ["secret_key"]
            if(key != secret_key):
                raise ValueError("Missing secret key")
            if not cur_url:
                raise ValueError("URL is missing in the request")

            browser = await p.chromium.launch()
            try:
                page = await browser.new_page()
                await page.goto(cur_url, timeout=30000)
                await page.wait_for_timeout(5000) 
                # Extracting absolute links only and avoiding duplicates
                links = await page.eval_on_selector_all("a[href]", """
                    (baseUrl) => {
                        const uniqueLinks = new Set();
                        const base = new URL(baseUrl);

                        for (const element of document.querySelectorAll('a[href]')) {
                            const href = element.href;

                            // Check if the link is absolute and not the same as the main URL
                            if ((href.startsWith('http://') || href.startsWith('https://')) && href !== base.href) {
                                // Normalize the URL by removing fragments and trailing slashes
                                const normalizedHref = href.split('#')[0].replace(/\/+$/, '').toLowerCase();
                                uniqueLinks.add(normalizedHref);  // Add to the Set to ensure uniqueness
                            }
                        }

                        // Convert the Set back to an array and return
                        return Array.from(uniqueLinks);
                    }
                """, cur_url)  # Pass the current URL as the base URL

                unique_links = list(links)  # Convert to a list if needed

                data = {}
                
                body_text = await page.evaluate("""
                    () => {
                        const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'NAV', 'ASIDE', 'FOOTER', 'BUTTON', 'SVG', 'FORM', 'TEXTAREA', 'SELECT'];
                        const excludeClasses = ['nav', 'navbar', 'header', 'footer', 'sidebar', 'menu'];
                        
                        function isExcluded(element) {
                            if (excludeTags.includes(element.tagName)) return true;
                            if (element.className && typeof element.className === 'string') {
                                for (const className of excludeClasses) {
                                    if (element.className.toLowerCase().includes(className)) return true;
                                }
                            }
                            return false;
                        }
                        
                        function getCleanText(node) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                return node.textContent.trim();
                            }
                            
                            if (node.nodeType !== Node.ELEMENT_NODE || isExcluded(node)) return '';
                            
                            let text = '';
                            for (const child of node.childNodes) {
                                text += ' ' + getCleanText(child);
                            }
                            
                            return text.trim();
                        }
                        
                        let cleanText = getCleanText(document.body);
                        
                        // Remove extra whitespace
                        cleanText = cleanText.replace(/\\s+/g, ' ').trim();
                        
                        return cleanText;
                    }
                """)
                
                if len(body_text) < 20:
                    raise ValueError("Insufficient content found on the page")
                    
                data[cur_url] = body_text

            except PlaywrightError as e:
                return {"error": "Failed to load or process the page", "details": str(e)}
            
            finally:
                await browser.close()

        return {"data": [{"url": cur_url, "content": data[cur_url]}], "links": unique_links}

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}