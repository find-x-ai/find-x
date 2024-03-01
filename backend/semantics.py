from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
from dotenv import load_dotenv
import os
from upstash_vector import Index

MODEL = "multi-qa-MiniLM-L6-cos-v1"
model = SentenceTransformer(MODEL, device="cpu")
load_dotenv()
Url = os.getenv("URL")
Token = os.getenv("Token")
index = Index(url=Url, token=Token)

def generate_embedding(json_data: str, client_id: str) -> None:
    data = json.dumps(json_data)
    spilter = RecursiveCharacterTextSplitter(
        separators=['\n\n', '\n', '\n\n\n', '.', '\t'],
        chunk_size=500,
        chunk_overlap=0
    )
    chunks = spilter.split_text(data)
    
    for id, value in enumerate(chunks):
        # Split each chunk into smaller parts before encoding
        sub_chunks = [value[i:i+100] for i in range(0, len(value), 100)]
        for sub_chunk in sub_chunks:
            result_vectors = model.encode([sub_chunk]).tolist()
            vector_with_metadata = {"id": str(id), "vector": result_vectors[0], "metadata": {"client_id": client_id, "Data": sub_chunk}}
            index.upsert(vectors=[vector_with_metadata])

    print(f"Generated {len(chunks)} embeddings.")