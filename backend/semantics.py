import json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os
from upstash_vector import Index

load_dotenv()
Url = os.getenv("URL")
Token = os.getenv("Token")
index = Index(url=Url, token=Token)

def generate_embedding(json_data: str, client_id: str) -> None:
    data = json.dumps(json_data)
    spilter = pd.TextSplitter(
        separators=['\n\n', '\n', '\n\n\n', '.', '\t'],
        chunk_size=300,
        chunk_overlap=0
    )
    chunks = spilter.split_text(data)
    
    for id, value in enumerate(chunks):
        # Split each chunk into smaller parts before encoding
        sub_chunks = [value[i:i+100] for i in range(0, len(value), 100)]
        for sub_chunk in sub_chunks:
            result_vectors = np.array([sub_chunk])
            vector_with_metadata = {"id": str(id), "vector": result_vectors[0], "metadata": {"client_id": client_id, "Data": sub_chunk}}
            index.upsert(vectors=[vector_with_metadata])

    print(f"Generated {len(chunks)} embeddings.")