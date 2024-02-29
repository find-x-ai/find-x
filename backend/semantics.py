from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
from dotenv import load_dotenv
import os
from upstash_vector import Index
MODEL = "multi-qa-MiniLM-L6-cos-v1"
model = SentenceTransformer(MODEL, device="cpu")
load_dotenv()
Url=os.getenv("URL")
Token=os.getenv("Token")
index = Index(url=Url, token=Token)
def generate_embedding(json_data: str,client_id: str) -> list[list[float]]:
  data=json.dumps(json_data)
  spilter=RecursiveCharacterTextSplitter(
    separators=['\n\n', '\n', '\n\n\n', '.','\t'],
    chunk_size=500,
    chunk_overlap=0
  )
  chunks=spilter.split_text(data)
  result_vectors = model.encode(chunks).tolist()
  print(f"Generated {len(result_vectors)} embeddings.")
  for id, value in enumerate(chunks):
    upsert_vector=[]
    vector_with_metadata = {"id":str(id), "vector": result_vectors[id], "metadata":{"client_id":client_id,"Data": value}}
    upsert_vector.append(vector_with_metadata)
    index.upsert(vectors=upsert_vector)