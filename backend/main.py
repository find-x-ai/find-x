from fastapi import FastAPI, HTTPException, BackgroundTasks
from typing import Optional
from urllib.parse import urlparse
from scraper import scrape_website

app = FastAPI()

@app.get('/')
async def home():
    return {
        "status": True,
        "message": "backend working..."
    }

async def scrape_and_notify(url: str):
    async for chunk in scrape_website(url):
        print(chunk)  # Print the first chunk or process it as needed
        # Send notification or perform any other action to indicate that the process has started
        return

@app.post("/scrape/")
async def scrape(data: dict, background_tasks: BackgroundTasks):
    url = data.get("url")
    if url is None:
        raise HTTPException(status_code=400, detail="URL parameter is required")

    # Check if the URL is valid
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        raise HTTPException(status_code=400, detail="Invalid URL")

    # Call the scraping function in the background
    background_tasks.add_task(scrape_and_notify, url)
    return {"status": "process started"}