import csv
from io import StringIO
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup, SoupStrainer
from collections import deque
import logging
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def scrape_website(base_url):
    visited_urls = set()
    session = requests.Session()

    # Function to fetch links from a given URL
    def fetch_links(url):
        response = session.get(url)
        if response.ok:
            soup = BeautifulSoup(response.content, "html.parser", parse_only=SoupStrainer('a'))
            for link in soup.find_all(href=True):
                absolute_url = urljoin(url, link['href'])
                if absolute_url.startswith(base_url) and absolute_url not in visited_urls:
                    visited_urls.add(absolute_url)
                    yield absolute_url

    # BFS crawl to fetch all links
    def bfs_crawl(start_url):
        logging.info(f"Starting BFS crawl from {start_url}")
        queue = deque([start_url])
        while queue:
            url = queue.popleft()
            logging.info(f"Visiting URL: {url}")
            yield url
            for link in fetch_links(url):
                logging.info(f"Found link: {link}")
                queue.append(link)

    # Fetch content for a single page
    def fetch_page_content(url):
        try:
            response = session.get(url, timeout=20)  # Set timeout to 20 seconds
            if response.ok:
                logging.info(f"Fetching content for URL: {url}")
                soup = BeautifulSoup(response.content, "html.parser")
                return {"URL": url, "Content": soup.get_text().strip()}
            else:
                logging.warning(f"Failed to fetch content for URL: {url}, status code: {response.status_code}")
        except requests.Timeout:
            logging.warning(f"Timeout occurred while fetching URL: {url}. Skipping...")

    # Generate list of dictionaries representing CSV data using ThreadPoolExecutor for parallel processing
    csv_data = []
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_page_content, url) for url in bfs_crawl(base_url)]
        for future in futures:
            page_data = future.result()
            if page_data:
                csv_data.append(page_data)

    return csv_data