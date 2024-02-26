import csv
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup, SoupStrainer
from collections import deque
import logging

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

    # Fetch content for all pages
    def fetch_page_content(urls):
        logging.info("Fetching page content...")
        for url in urls:
            try:
                response = session.get(url, timeout=20)  # Set timeout to 20 seconds
                if response.ok:
                    logging.info(f"Fetching content for URL: {url}")
                    soup = BeautifulSoup(response.content, "html.parser")
                    yield url, soup.get_text().strip()
                else:
                    logging.warning(f"Failed to fetch content for URL: {url}, status code: {response.status_code}")
            except requests.Timeout:
                logging.warning(f"Timeout occurred while fetching URL: {url}. Skipping...")

    # Write to CSV
    csv_filename = "pages.csv"
    with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["URL", "Content"])  # Write column headers
        for url, content in fetch_page_content(bfs_crawl(base_url)):
            writer.writerow([url, content])

    print(f"CSV file '{csv_filename}' has been created successfully.")
    return "pages.csv"