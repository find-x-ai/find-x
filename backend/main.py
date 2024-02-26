# api to get client information
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get('/')
async def home():
    return {"message": "working"}