from modal import Stub, build, enter, method, web_endpoint, Image
from typing import Dict
import os
import modal
from sentence_transformers import SentenceTransformer
from langchain.embeddings.base import Embeddings

image = Image.debian_slim().pip_install(
    "upstash_vector",
    "sentence-transformers",
    "langchain_experimental"
)
stub = Stub(name="find-x", image=image)

class SentenceTransformerEmbeddings(Embeddings):
    def _init_(self, model_name_or_path: str ="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name_or_path)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self.model.encode(texts)

    def embed_query(self, text: str) -> list[float]:
        return self.model.encode([text])[0]

@stub.function(secrets=[modal.Secret.from_name("my-custom-secret"), modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")], timeout=1000)
@web_endpoint(label="embed", method="POST")
def generate_embedding(requestData: Dict):
    from langchain_experimental.text_splitter import SemanticChunker
    from upstash_vector import Index
    from sentence_transformers import SentenceTransformer
    import os

    key = os.environ["key_secret"]
    
    data = requestData["data"]  # data is an array of dict i.e. [{"url": string, "content": string}]
    client_id = requestData["client"]  # client id is a string
    secret_key = requestData["secret_key"]
    
    if secret_key != key:
        return {"error": "Invalid upsert key!"}
    
    my_list = []
    for item in data:
        url = item.get("url", "")
        content = item.get("content", "")
        my_list.append({'content': content, 'url': url})

    upstash_token = os.environ["Token"]
    upstash_url = os.environ["URL"]

    index = Index(url=upstash_url, token=upstash_token)  # initialize the vector index
    chunks = []
    text_splitter = SemanticChunker(SentenceTransformerEmbeddings(), breakpoint_threshold_type="interquartile")

    try:
        for id, value in enumerate(my_list):
            content = value['content']
            url = value['url']
            docs = text_splitter.create_documents([content])

            # Process and merge chunks if necessary
            for chunk_id, doc in enumerate(docs):
                sentences = doc.page_content.split('.')
                if len(sentences) < 5:
                    # If the chunk has less than 5 sentences, merge it with the previous chunk
                    if chunks:
                        # Merge with the last chunk
                        chunks[-1] += ' ' + doc.page_content
                    else:
                        # If there's no previous chunk, just add this one
                        chunks.append(doc.page_content)
                else:
                    # If the chunk is valid, add it to the list
                    chunks.append(doc.page_content)

        # Upsert valid chunks to the index
        for chunk_id, chunk in enumerate(chunks):
            index.upsert(
                vectors=[
                    (f"{url}{client_id}{chunk_id}", chunk, {"client_id": client_id, "url": url, "Data": chunk}),
                ],
                namespace=client_id
            )

        return {
            "Status": "success",
            "message": "Successfully generated embedding...",
            "chunks": chunks,
        }
    except Exception as e:
        return {
            "Status": "error",
            "message": str(e),
        }