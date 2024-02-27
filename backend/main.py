from fastapi import FastAPI, HTTPException, Response
from typing import Optional
from urllib.parse import urlparse
from scraper import scrape_website
from fastapi.responses import StreamingResponse

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

    # Define a generator function to stream the response
    def generate_csv_data():
        try:
            for page_data in scrape_website(url):
                yield f"{page_data}\n"  # Convert each page data to string format
        except Exception as e:
            yield str(e)

    # Return a StreamingResponse to stream the response back to the client in chunks
    return StreamingResponse(content=generate_csv_data(), media_type="text/csv")