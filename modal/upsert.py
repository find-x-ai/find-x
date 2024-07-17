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
    def __init__(self, model_name_or_path: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name_or_path)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self.model.encode(texts)

    def embed_query(self, text: str) -> list[float]:
        return self.model.encode([text])[0]

@stub.function(secrets=[modal.Secret.from_name("my-custom-secret"),modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")] ,timeout=1000)
@web_endpoint(label="embed", method="POST")
def generate_embedding(requestData: Dict):
    from langchain_experimental.text_splitter import SemanticChunker
    from upstash_vector import Index
    key = os.environ["key_secret"]
    
    data = requestData["data"]  # data is array of dict i.e. [{"url": string, "content": string}]
    client_id = requestData["client"]  # client id is string
    secret_key=requestData["secret_key"]
    
    
    if(secret_key!=key):
        return {"error": "Invalid upsert key!"}
    else:
        my_list = []
        for item in data:
            url = item.get("url", "")
            content = item.get("content", "")
            my_list.append({'content': content, 'url': url})

        upstash_token = os.environ["Token"]
        upstash_url = os.environ["URL"]

        index = Index(url=upstash_url, token=upstash_token)  # initialize the vector index
        chunks=[]
        text_splitter = SemanticChunker(SentenceTransformerEmbeddings(),breakpoint_threshold_type="standard_deviation")
        try:
            for id, value in enumerate(my_list):
                content = value['content']
                url = value['url']
                docs = text_splitter.create_documents([content])

                for chunk_id, doc in enumerate(docs):
                    index.upsert(
                        vectors=[
                            (f"{url}_{client_id}", doc.page_content, {"client_id": client_id, "url": url, "Data": doc.page_content}),
                        ],
                        namespace=client_id
                    )
                    chunks.append(doc.page_content)
            return {
                "Status": "success",
                "message": "successfully generated embedding...",
                "chunks":chunks,
            }
        except Exception as e:
                return {
                    "Status": "error",
                    "message": str(e),
                }