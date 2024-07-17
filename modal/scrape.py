import modal
from modal import Stub, build, enter, method, web_endpoint, Image
import asyncio
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

@stub.function()
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        cur_url = request['url']
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(cur_url)
        
        links = await page.eval_on_selector_all("a[href]", "elements => elements.map(element => element.href)")
        
        unique_links = list(set(links))

        data = {}
        
        body_text = await page.evaluate("""
            () => {
                const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'NAV' , 'ASIDE' , 'FOOTER' , 'BUTTON' , 'SVG' , 'FORM' , 'TEXTAREA' , 'SELECT' ];
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
                
                function findMainContent() {
                    const possibleContentSelectors = [
                        'main',
                        '#main',
                        '#content',
                        '.main',
                        '.content',
                        'article',
                        '.post',
                        '#post'
                    ];
                    
                    for (const selector of possibleContentSelectors) {
                        const element = document.querySelector(selector);
                        if (element) return element;
                    }
                    
                    return document.body;  // fallback to body if no main content area found
                }
                
                const mainContent = findMainContent();
                let cleanText = getCleanText(mainContent);
                
                // Remove extra whitespace
                cleanText = cleanText.replace(/\\s+/g, ' ').trim();
                
                return cleanText;
            }
        """)
        
        data[cur_url] = body_text
        
        await browser.close()

        return {"data": [{"url": cur_url, "content": data[cur_url]}], "links": unique_links}