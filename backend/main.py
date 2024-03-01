from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from embed import start_embedding
app = FastAPI()


@app.get('/')
async def home_page():
    return {
        "status": True,
        "message":"backend working fine..."
    }

@app.post("/generate_embeddings/")
async def generate_embeddings():
    try:
       res = start_embedding()
       return res
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
