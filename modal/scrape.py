import re
from bs4 import BeautifulSoup
import os
import modal
from modal import App, web_endpoint, current_function_call_id
from typing import Dict
import aiohttp
from PIL import Image
from io import BytesIO
from urllib.parse import urlparse
from playwright.async_api import async_playwright, Error as PlaywrightError
from markdownify import markdownify as md
import asyncio
from collections import deque
from upstash_redis import Redis
from urllib.robotparser import RobotFileParser
import json
from neon_db import connect_to_db, function_call_id

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
    "pip install markdownify beautifulsoup4 pillow aiohttp",
    "pip install upstash-redis",
    "pip install requests",
    "pip install psycopg2-binary"
)

app = App(name="link-scraper", image=playwright_image)

@app.function(secrets=[modal.Secret.from_name("upstash"), modal.Secret.from_name("Database"), modal.Secret.from_name("server")], timeout=3600)
@web_endpoint(label="scrape", method="POST")
async def crawl_website(request: Dict):
    secret_key = request['secret_key']
    crawl_secret = os.environ["CRAWL_SECRET"]
    if secret_key != crawl_secret:
        raise ValueError("Invalid secret key")
    start_url = request.get('url')
    process_id = request.get('id')
    max_url = request.get('max_url', None)
    Database_url = os.environ["DATABASE_URL"]
    conn = connect_to_db(Database_url)
    function_call_id(conn, process_id, current_function_call_id())

    try:

        def get_base_url(url):
            parsed = urlparse(url)
            netloc = parsed.netloc.replace('www.', '')
            return f"{parsed.scheme}://{netloc}"

        def normalize_url(url):
            parsed = urlparse(url)
            netloc = parsed.netloc.replace('www.', '')
            return f"{parsed.scheme}://{netloc}{parsed.path.rstrip('/')}"

        def is_internal_link(link, base_url):
            link_without_www = link.replace('://www.', '://')
            base_without_www = base_url.replace('://www.', '://')
            return link_without_www.startswith('/') or link_without_www.startswith(base_without_www)

        if not process_id:
            raise ValueError("Process ID is missing in the request")

        secret_key = os.environ['secret_key']
        upstash_url = os.environ["UPSTASH_REDIS_URL"]
        upstash_password = os.environ["UPSTASH_REDIS_PASS"]

        if not start_url:
            raise ValueError("URL is missing in the request")

        redis = Redis(url=upstash_url, token=upstash_password)
        process_key = f"process_{process_id}"

        redis.set(process_key, json.dumps({
            "queueLength": 0,
            "scrapedDataLength": 0,
            "visitedLength": 0,
            "percentage": 0
        }))

        base_url = get_base_url(start_url)

        queue = deque([normalize_url(start_url)])
        visited = set()
        scraped_data = []
        batch_size = 20
        request_delay = 0.2

        robot_parser = None
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(f"{base_url}/robots.txt") as response:
                    if response.status == 200:
                        robot_parser = RobotFileParser()
                        robot_parser.set_url(f"{base_url}/robots.txt")
                        content = await response.text()
                        robot_parser.parse(content.splitlines())
                    else:
                        pass
            except Exception as e:
                pass

        async with async_playwright() as p:
            browser = await p.chromium.launch()

            batch_number = 0
            while queue and len(visited) < max_url:
                batch_number += 1
                current_batch = []
                batch_urls = []
                remaining_urls = max_url - len(visited)
                current_batch_size = min(batch_size, remaining_urls, len(queue))
                for _ in range(min(current_batch_size, len(queue))):
                    if queue:
                        url = queue.popleft()
                        if url not in visited:
                            current_batch.append(url)
                            batch_urls.append(url)
                            visited.add(url)

                if not current_batch:
                    continue

                async def process_url_with_retry(url, page):
                    try:
                        await page.set_extra_http_headers({
                            'User-Agent': 'Mozilla/5.0 (compatible; CustomBot/1.0; +http://example.com/bot)'
                        })

                        if robot_parser and not robot_parser.can_fetch("*", url):
                            return None

                        await page.goto(
                            url,
                            timeout=45000,
                            wait_until="domcontentloaded"
                        )

                        await asyncio.sleep(2)

                        links_task = page.eval_on_selector_all("a[href]", """
                            (baseUrl) => {
                                const uniqueLinks = new Set();
                                const base = new URL(baseUrl);
                                const normalizedBase = (base.origin + base.pathname).replace(/\/+$/, '').replace('://www.', '://');

                                for (const element of document.querySelectorAll('a[href]')) {
                                    let href = element.href;

                                    if ((href.startsWith('http://') || href.startsWith('https://')) && href !== base.href) {
                                        href = href.split(/[?#]/)[0];
                                        const normalizedHref = href.replace(/\/+$/, '').replace('://www.', '://');

                                        if (normalizedHref !== normalizedBase && ((normalizedHref + '/') !== normalizedBase)) {
                                            uniqueLinks.add(normalizedHref);
                                        }
                                    }
                                }

                                return Array.from(uniqueLinks);
                            }
                        """, url)

                        images_task = page.eval_on_selector_all("img[src]", """
                            (baseUrl) => {
                                const images = [];
                                for (const element of document.querySelectorAll('img[src]')) {
                                    if (element.closest('nav') || element.closest('aside')) {
                                        continue;
                                    }
                                    
                                    const rect = element.getBoundingClientRect();
                                    const width = Math.round(rect.width);
                                    const height = Math.round(rect.height);
                                    
                                    if (width < 100 || height < 100) continue;

                                    let src = element.src;
                                    if (!src.startsWith('http://') && !src.startsWith('https://')) {
                                        src = new URL(src, baseUrl).href;
                                    }
                                    const alt = element.alt || 'No description available';
                                    
                                    images.push({
                                        src: src,
                                        alt: alt,
                                        width: width,
                                        height: height
                                    });
                                }
                                return images;
                            }
                        """, url)

                        html_content_task = page.content()

                        links, images, html_content = await asyncio.gather(
                            links_task, images_task, html_content_task
                        )

                        for link in links:
                            if is_internal_link(link, base_url):
                                normalized_link = normalize_url(link)
                                if normalized_link not in visited and normalized_link not in queue:
                                    queue.append(normalized_link)

                        min_width = 200
                        min_height = 200
                        valid_images = []
                        seen_alts = set()

                        for img in images:
                            if img['alt'] in seen_alts:
                                continue
                            
                            width = img['width']
                            height = img['height']
                            
                            if (width >= min_width and height >= min_height and 
                                (width / height < 3) and (height / width < 3)):
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
                            parsed_url = urlparse(url)
                            title = parsed_url.netloc

                        readable_text = soup.get_text(separator=' ').lower().replace('\n', ' ').strip()
                        readable_text = re.sub(r'[^\x00-\x7F]', '', readable_text)

                        for placeholder, original_html in table_placeholders:
                            markdown_table = md(original_html)
                            readable_text = readable_text.replace(placeholder, markdown_table, 1)

                        for placeholder, original_html in code_placeholders:
                            markdown_code = md(original_html)
                            readable_text = readable_text.replace(placeholder, markdown_code, 1)

                        title_lower = title.lower()
                        if readable_text.startswith(title_lower + ' '):
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

                        return {
                            "url": url,
                            "title": title,
                            "content": markdown_output,
                            "summary": summary,
                            "images": {"data": valid_images}
                        }

                    except PlaywrightError as e:
                        return None

                async def process_url(url):
                    try:
                        page = await browser.new_page()
                        try:
                            return await process_url_with_retry(url, page)
                        finally:
                            await page.close()
                            await asyncio.sleep(request_delay)
                    except Exception as e:
                        return None

                results = await asyncio.gather(
                    *[process_url(url) for url in current_batch]
                )

                successful_urls = [url for url, r in zip(batch_urls, results) if r is not None]
                failed_urls = [url for url, r in zip(batch_urls, results) if r is None]

                if successful_urls:
                    pass

                if failed_urls:
                    pass

                new_results = [r for r in results if r is not None]
                scraped_data.extend(new_results)

                current_state = {
                    'queueLength': len(queue),
                    'scrapedDataLength': len(scraped_data),
                    'visitedLength': len(visited),
                    'percentage': min(80, int((1 - (len(queue) / (len(visited) + len(queue)))) * 100)) if (len(visited) + len(queue)) > 0 else 0
                }
                redis.set(process_key, json.dumps(current_state))

                if len(visited) >= max_url:
                    break
            await browser.close()

        return {
            "status": "success",
            "totalLinks": len(visited),
            "scrapedLinks": len(scraped_data),
            "indexId": process_id,
            "data": scraped_data
        }

    except ValueError as ve:
        return {
            "status": "error",
            "totalLinks": 0,
            "scrapedLinks": 0,
            "indexId": process_id,
            "error": str(ve)
        }
    except Exception as e:
        return {
            "status": "error",
            "totalLinks": 0,
            "scrapedLinks": 0,
            "indexId": process_id,
            "error": f"An unexpected error occurred. {str(e)}",
            "details": str(e)
        }