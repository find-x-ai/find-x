from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from embed import start_embedding
import asyncio

app = FastAPI()

class Name(BaseModel):
    name: str

async def background_task(name):
    await asyncio.sleep(0)  # Simulate some background work
    await start_embedding(name=name)

@app.get('/')
async def home_page():
    return {
        "status": True,
        "message": "backend working fine..."
    }

@app.post("/generate_embeddings/")
async def generate_embeddings(name: Name):
    asyncio.create_task(background_task(name.name))
    return {
        "status": True,
        "message": "Embedding process has started..."
    }