from fastapi import FastAPI, HTTPException
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


@app.post("/scrape/")
async def scrape(data: dict):
    url = data.get("url")
    if url is None:
        raise HTTPException(status_code=400, detail="URL parameter is required")

    # Check if the URL is valid
    parsed_url = urlparse(url)
    if not all([parsed_url.scheme, parsed_url.netloc]):
        raise HTTPException(status_code=400, detail="Invalid URL")

    # Call the scraping function
    try:
        csv_filename = scrape_website(url)
        return {"status": "success", "csv_filename": csv_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
