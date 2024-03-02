from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from embed import start_embedding
app = FastAPI()

class Name(BaseModel):
    name: str


@app.get('/')
async def home_page():
    return {
        "status": True,
        "message":"backend working fine..."
    }

@app.post("/generate_embeddings/")
async def generate_embeddings(name: Name):
    try:
        start_embedding(name=name.name)
        return {
            "status": True,
            "message":"embedding started successfully!!!!!!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))