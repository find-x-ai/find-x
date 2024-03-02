from modal import Stub, web_endpoint,Image
from typing import Dict
import os
import modal

image = Image.debian_slim().pip_install(
    "sentence_transformers",
    "upstash_vector",
    "langchain",
    
)

stub = Stub(name="find-x", image=image)

@stub.function(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")])
@web_endpoint(method="POST")
def generate_embedding(requestData : Dict):
    #imports
    from sentence_transformers import SentenceTransformer
    from upstash_vector import Index
    
    MODEL = "multi-qa-MiniLM-L6-cos-v1"
    model = SentenceTransformer(MODEL, device="cpu")

    data = requestData["data"]  #data is array of dict i.e. [{url: string , content: string }]
    
    print(len(data))
    
    #environmen variables
    upstash_token = os.environ["Token"] 
    upstash_url = os.environ["URL"]
    
    index = Index(url=upstash_url, token=upstash_token) #initialize the vector index

  
    return {
        "Status": "success",
        "message": "successfully generated embedding...",
    }