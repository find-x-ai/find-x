from fastapi import FastAPI,HTTPException
from pydantic import BaseModel

app = FastAPI()

class Name(BaseModel):
    name: str


@app.get('/')
async def home_page():
    return {
        "status": True,
        "message":"backend working fine..."
    }

