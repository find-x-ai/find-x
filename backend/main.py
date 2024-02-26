import asyncio  # Import asyncio module for sleep function
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

async def scrape_and_print(url: str):
    async for chunk in scrape_website(url):
        print(chunk)  # Print each chunk
        # Process the chunk or send it to the client
        # For demonstration, let's just sleep for 1 second to simulate processing time
        await asyncio.sleep(1)  # Adjust the sleep time here

@app.post("/scrape/")
async def scrape(data: dict, background_tasks: BackgroundTasks):
    url = data.get("url")
    if url is None:
        raise HTTPException(status_code=400, detail="URL parameter is required")

    # Check if the URL is valid
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        raise HTTPException(status_code=400, detail="Invalid URL")

    # Return "process started" response immediately
    response = {"status": "process started"}

    # Call the scraping function in the background
    background_tasks.add_task(scrape_and_print, url)

    return response