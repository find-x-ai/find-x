import concurrent.futures
import requests
from bs4 import BeautifulSoup

def fetch_content(url):
    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract text content with spaces between paragraphs
    paragraphs = []
    for paragraph in soup.find_all('p'):
        paragraphs.append(paragraph.get_text())
    
    text_content = '\n\n'.join(paragraphs)  # Join paragraphs with double newline for spacing
    
    return url, text_content

def scrape_links(links):
    result_dict = {}
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {executor.submit(fetch_content, url): url for url in links}
        for future in concurrent.futures.as_completed(futures):
            url = futures[future]
            try:
                result_dict[url] = future.result()
            except Exception as e:
                result_dict[url] = str(e)
    return result_dict