# api to get client information
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get('/')
async def home():
    return {
         "status": True,
        "message": "backend working..."
        }

@app.post('/scrape')
async def scrape():
      return {
          "status": True,
          "message": "scraping working..."
      }