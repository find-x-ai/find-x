import modal
from modal import Stub, build, enter, method, web_endpoint,Image
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
            
        body_text = await page.evaluate("document.querySelector('body').innerText")
        body_text = body_text.replace('\n', ' ')
        data[cur_url] = body_text
            
        await browser.close()

        return {"data": [{"url": cur_url, "content": data[cur_url]}], "links": unique_links}