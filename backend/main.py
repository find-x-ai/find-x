from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from semantics import generate_embedding,index
app = FastAPI()

@app.get('/')
async def home_page():
    return {
        "status": True,
        "message":"backend working fine..."
    }

@app.post("/generate_embeddings/")
async def generate_embeddings():
    print("got embedding request")
    generate_embedding()
    return {
        "status": True,
        "message":"generating embeddings..."
    }


@app.post("/query_data/")
async def query_data():
    print("got query data request")
    return {
        "status": True,
        "message":"Query data request..."
    }