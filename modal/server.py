from modal import Stub, enter, method, web_endpoint,Image
from typing import Dict
import os
import modal

image = Image.debian_slim().pip_install(
    "sentence_transformers",
    "upstash_vector",
    "langchain",  
)

stub = Stub(name="find-x", image=image)

@stub.function(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")],timeout=1000)
@web_endpoint(method="POST")
def generate_embedding(requestData : Dict):
    #imports
    from sentence_transformers import SentenceTransformer
    from upstash_vector import Index
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    
    embeddings = []  

    
    MODEL = "multi-qa-MiniLM-L6-cos-v1"
    model = SentenceTransformer(MODEL, device="cpu")

    data = requestData["data"]  #data is array of dict i.e. [{url: string , content: string }]
    clientId = requestData["client"] #client id is string
    
    for id, item in enumerate(data):
        url = item.get("url", "")
        content = item.get("content", "")
        
        
        text_to_encode = f"{url} {content}"

        spilter = RecursiveCharacterTextSplitter(
            separators=['\n\n', '\n', '\n\n\n', '.', '\t'],
            chunk_size=400,
            chunk_overlap=0
        )
        chunks = spilter.split_text(text_to_encode)
        embeddings.extend(model.encode(chunks).tolist())

    print(f"Generated {len(embeddings)} embeddings.")
    
    print(len(data))
    
    #environmen variables
    upstash_token = os.environ["Token"] 
    upstash_url = os.environ["URL"]
    
    index = Index(url=upstash_url, token=upstash_token) #initialize the vector index

    upsert_vector = []
    for id, value in enumerate(data):
        vector_with_metadata = {
            "id": str(id),
            "vector": embeddings[id],
            "metadata": {"client_id": clientId, "Data": value}
        }
        upsert_vector.append(vector_with_metadata)

    index.upsert(vectors=upsert_vector)
    print(f"Generated {len(data)} embeddings.")
    
    return {
        "Status": "success",
        "message": "successfully generated embedding...",
    }
    
@stub.cls(keep_warm=1,secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")])
class Model:
    @enter()
    def start_model(self):
      from sentence_transformers import SentenceTransformer
      from upstash_vector import Index  
      MODEL = "multi-qa-MiniLM-L6-cos-v1"
      self.model = SentenceTransformer(MODEL, device="cpu")
      upstash_token = os.environ["Token"] 
      upstash_url = os.environ["URL"]
      self.index = Index(url=upstash_url, token=upstash_token)
     
    @method()
    def query_data(self, query):
        encode = self.model.encode(query)
        answer = self.index.query(vector=encode, top_k=2, include_metadata=True, include_vectors=False)      
        return {"message": "Query data processed successfully" , "answer": answer}