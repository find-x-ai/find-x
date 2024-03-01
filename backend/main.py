from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
import json
from semantics import generate_embedding,model,index
app = FastAPI()

class RequestData(BaseModel):
    client_id: str
    data: str
    key:int
class QueryData(BaseModel):
    query: str

@app.get('/')
async def home_page():
    return {
        "status": True,
        "message":"backend working fine..."
    }

@app.post("/generate_embeddings/")
async def generate_embeddings(request_data: RequestData):
    try:
        client_id = request_data.client_id
        json_data = {request_data.key: request_data.data}
        embeddings = generate_embedding(json_data,client_id)
        return {"message": "Database created successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))