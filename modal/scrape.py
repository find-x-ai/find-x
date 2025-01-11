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
from collections import deque
from upstash_redis import Redis
import time
from tenacity import retry, stop_after_attempt, wait_exponential
from urllib.robotparser import RobotFileParser
import traceback
import json
from datetime import datetime

playwright_image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "apt-get update",
    "apt-get install -y software-properties-common",
    "apt-add-repository non-free",
    "apt-add-repository contrib",
    "pip install playwright==1.30.0",
    "playwright install-deps chromium",
    "playwright install chromium",
    "pip install markdownify beautifulsoup4 pillow aiohttp",
    "pip install upstash-redis"
)

app = App(name="link-scraper", image=playwright_image)

@app.function(secrets=[modal.Secret.from_name("secret_key"), modal.Secret.from_name("upstash")], timeout=3600)
@web_endpoint(label="scrape", method="POST")
async def crawl_website(request: Dict):
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

        start_url = request.get('url')
        key = request.get('secret_key')
        process_id = request.get('id')
        
        if not process_id:
            raise ValueError("Process ID is missing in the request")

        secret_key = os.environ.get('secret_key')
        # Upstash redis url and password
        upstash_url = os.environ["UPSTASH_URL"]
        upstash_password = os.environ["UPSTASH_PASSWORD"]

        if key != secret_key:
            raise ValueError("Invalid secret key")
        if not start_url:
            raise ValueError("URL is missing in the request")

        # Initialize Redis client
        redis = Redis(url=upstash_url, token=upstash_password)
        process_key = f"process_{process_id}"

        # Initialize with 0% progress since we're just starting
        redis.set(process_key, json.dumps({
            "queueLength": 0,
            "scrapedDataLength": 0,
            "visitedLength": 0,
            "percentage": 0
        }))
        
        # Get base_url before using it
        base_url = get_base_url(start_url)

        # Initialize crawling state
        queue = deque([normalize_url(start_url)])
        visited = set()
        scraped_data = []
        batch_size = 20
        request_delay = 0.2

        # Try to load existing state from Redis
        
   

        # Initialize robots.txt parser
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
            while queue:
                batch_number += 1
                current_batch = []
                batch_urls = []
                for _ in range(min(batch_size, len(queue))):
                    if queue:
                        url = queue.popleft()
                        if url not in visited:
                            current_batch.append(url)
                            batch_urls.append(url)
                            visited.add(url)

                if not current_batch:
                    continue

                # Process batch concurrently
                async def process_url_with_retry(url, page):
                    try:
                        # Add user agent
                        await page.set_extra_http_headers({
                            'User-Agent': 'Mozilla/5.0 (compatible; CustomBot/1.0; +http://example.com/bot)'
                        })
                        
                        if robot_parser and not robot_parser.can_fetch("*", url):
                            return None

                        # Modified navigation options
                        await page.goto(
                            url,
                            timeout=45000,  # Increased timeout to 45 seconds
                            wait_until="domcontentloaded"  # Changed from "networkidle" to "domcontentloaded"
                        )
                        
                        # Add a small delay to allow for dynamic content
                        await asyncio.sleep(2)

                        # Gather tasks concurrently
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
                                    // Check if the image is inside a <nav> or <aside> element
                                    if (element.closest('nav') || element.closest('aside')) {
                                        continue;
                                    }
                                    let src = element.src;
                                    if (!src.startsWith('http://') && !src.startsWith('https://')) {
                                        src = new URL(src, baseUrl).href;
                                    }
                                    const alt = element.alt || 'No description available';
                                    images.push({src, alt});
                                }
                                return images;
                            }
                        """, url)

                        html_content_task = page.content()

                        links, images, html_content = await asyncio.gather(
                            links_task, images_task, html_content_task
                        )

                        # Process new links
                        for link in links:
                            if is_internal_link(link, base_url):
                                normalized_link = normalize_url(link)
                                if normalized_link not in visited and normalized_link not in queue:
                                    queue.append(normalized_link)

                        min_width = 200
                        min_height = 200

                        async def is_valid_image(img_url):
                            try:
                                async with aiohttp.ClientSession() as session:
                                    async with session.get(img_url, timeout=10) as response:
                                        if response.status == 200:
                                            img_data = await response.read()
                                            img = Image.open(BytesIO(img_data))
                                            width, height = img.size
                                            if width >= min_width and height >= min_height and (width / height < 3) and (height / width < 3):
                                                return True
                            except Exception as e:
                                pass
                            return False

                        valid_images = []
                        seen_alts = set()

                        try:
                            # Process images in smaller batches to avoid overwhelming the server
                            batch_size = 5
                            for i in range(0, len(images), batch_size):
                                batch = images[i:i + batch_size]
                                image_validation_tasks = [
                                    is_valid_image(img['src']) 
                                    for img in batch 
                                    if img['alt'] not in seen_alts
                                ]
                                
                                try:
                                    valid_flags = await asyncio.gather(*image_validation_tasks, return_exceptions=True)
                                    
                                    # Process results, handling any exceptions
                                    for img, result in zip(batch, valid_flags):
                                        if isinstance(result, Exception):
                                            continue
                                            
                                        if result and img['alt'] not in seen_alts:
                                            valid_images.append(img)
                                            seen_alts.add(img['alt'])
                                                
                                        if len(valid_images) >= 10:
                                            break
                                                
                                except Exception as e:
                                    continue
                                        
                        except Exception as e:
                            # Continue with empty images rather than failing
                            valid_images = []

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
                            parsed_url = urlparse(url)
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
                
                # Log batch results
                successful_urls = [url for url, r in zip(batch_urls, results) if r is not None]
                failed_urls = [url for url, r in zip(batch_urls, results) if r is None]
                
                if successful_urls:
                    # Log individual URLs at debug level if needed
                    for url in successful_urls:
                        pass

                if failed_urls:
                    # Log individual failed URLs separately
                    for url in failed_urls:
                        pass

                # Add successful results to scraped_data
                new_results = [r for r in results if r is not None]
                scraped_data.extend(new_results)

                # Update Redis with current state after each batch
                current_state = {
                    'queueLength': len(queue),
                    'scrapedDataLength': len(scraped_data),
                    'visitedLength': len(visited),
                    'percentage': min(80, int((1 - (len(queue) / (len(visited) + len(queue)))) * 100)) if (len(visited) + len(queue)) > 0 else 0
                }
                redis.set(process_key, json.dumps(current_state))

            await browser.close()

        return {
            "data": scraped_data,
            "totalLinks": len(visited)
        }

    except ValueError as ve:
        return {"error": str(ve)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}