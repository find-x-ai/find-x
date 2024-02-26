from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import StreamingResponse
from urllib.parse import urlparse
from scraper import scrape_website
import json

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

    # Function to stream the data
    async def stream_data():
        async for chunk in scrape_website(url):
            yield json.dumps(chunk).encode() + b'\n'  # Encode each chunk as JSON and add a newline delimiter

    # Return the streamed response
    return StreamingResponse(stream_data(), media_type="application/json")