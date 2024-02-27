from fastapi import FastAPI, HTTPException
from typing import List
from urllib.parse import urlparse
from scraper import scrape_links
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/')
async def home():
    return {
        "status": True,
        "message": "backend working..."
    }

@app.post("/scrape/")
async def scrape(data: dict):
    try:
        links = data.get('links', [])
        if not isinstance(links, List):
            raise HTTPException(status_code=400, detail="Links must be provided as a list in the 'links' field.")
        
        result_dict = scrape_links(links)
        
        return JSONResponse(content=result_dict)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))