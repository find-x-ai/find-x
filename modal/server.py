from modal import Stub, build, enter, method, web_endpoint,Image
from typing import Dict
import os
import modal

image = Image.debian_slim().pip_install(
    "sentence_transformers",
    "upstash_vector",
    "langchain",
    "openai"
)

stub = Stub(name="find-x", image=image)

@stub.function(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")],timeout=1000)
@web_endpoint(label="embed",method="POST")
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
    
@stub.function()
@web_endpoint(label="query",method="POST")
def start_query(requestData : Dict):
    from fastapi.responses import StreamingResponse
    query = requestData["query"]
    # res = Model.query_data.remote(query)
    return StreamingResponse(Model.query_data.remote_gen(query), media_type="text/event-stream")

@stub.cls(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url"),modal.Secret.from_name("open-ai-key")])
class Model:
    @build()
    @enter()
    def start_model(self):
        from sentence_transformers import SentenceTransformer
        from upstash_vector import Index
        from openai import OpenAI
        MODEL = "multi-qa-MiniLM-L6-cos-v1"
        self.model = SentenceTransformer(MODEL, device="cpu")
        upstash_token = os.environ["Token"] 
        upstash_url = os.environ["URL"]
        self.index = Index(url=upstash_url, token=upstash_token)
        open_ai_key = os.environ["open_ai_key"]
        self.client = OpenAI(api_key=open_ai_key)
        self.instructions = """You are a chat assistant. Your name is find-X. You will recieve query and data as input. Query will be question of the user. You have to answer the query by only depending on the data 
        provided by the vector database in data part. When user greets you can greet back without depending on the data part. When the given data part is not enough to anser the query simply deny the user by responding cant assist with the query or similar responses.
        don't give lengthy extra information just keep it up to point and assist the user. If any code is detected in the recieved data part then identify the language and assist with the code snippet by solving users query about the code snippet."""
        
    @method()
    def query_data(self,query:str):
        from fastapi.responses import StreamingResponse
        encode = self.model.encode(query)
        answer = self.index.query(vector=encode, top_k=2, include_metadata=True, include_vectors=False) 
        data = f"query : {query} , data: {answer}"    
        for chunk in self.client.chat.completions.create(
                       model="gpt-3.5-turbo",
                       messages=[{"role": "system", "content": self.instructions},{"role": "user", "content": data.replace("\n", "").replace(" ", "").replace("\t", "")}],
                       stream=True,
                       ):
            content = chunk.choices[0].delta.content
            if content is not None:
               print(content, end="")
               yield content