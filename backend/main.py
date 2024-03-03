from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
import modal
from typing import List


app = FastAPI()

f = modal.Cls.lookup("find-x","Model")

class QueryData(BaseModel):
    query: str


@app.get("/")
def home():
    return {
        "message": "working...."
    }
@app.post("/query_data/")
async def query_data(req: dict):
   query = req["query"]
   print("query data", query)
   res = f.query_data.remote(query)
   return res