import modal
from modal import Stub, build, enter, method, web_endpoint, Image
import asyncio
from typing import Dict

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "apt-get install -y libxml2-dev libxslt1-dev python3-dev",
    "pip install playwright==1.30.0 readability-lxml lxml[html_clean] bs4",
    "playwright install-deps chromium",
    "playwright install chromium",
)

stub = Stub(name="link-scraper", image=playwright_image)

@stub.function()
@web_endpoint(label="scrape", method="POST")
async def get_links(request: Dict):
    from playwright.async_api import async_playwright
    from readability.readability import Document
    from bs4 import BeautifulSoup

    async with async_playwright() as p:
        cur_url = request['url']
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(cur_url)

        html = await page.content()
        doc = Document(html)
        body_html = doc.summary()

        # Use BeautifulSoup to clean the HTML tags
        soup = BeautifulSoup(body_html, 'html.parser')
        body_text = soup.get_text(separator=' ')

        links = await page.eval_on_selector_all("a[href]", "elements => elements.map(element => element.href)")
        unique_links = list(set(links))

        data = {cur_url: body_text}

        await browser.close()

        return {"data": [{"url": url, "content": content} for url, content in data.items()], "links": unique_links}
