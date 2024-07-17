# from modal import Stub, build, enter, method, web_endpoint,Image
# from typing import Dict
# import os
# import modal

# image = Image.debian_slim().pip_install(
#     "upstash_vector",
#     "openai"
# )

# stub = Stub(name="find-x", image=image)

# @stub.function(timeout=1000)
# @web_endpoint(label="embed",method="POST")
# def generate_embedding(requestData : Dict):
#     #imports
    
#     from upstash_vector import Index

#     data = requestData["data"]  #data is array of dict i.e. [{url: string , content: string }]
#     clientId = requestData["client"] #client id is string
#     my_list=[]
    
#     return {"message": "not allowed!"}
    
#     for id, item in enumerate(data):
#         url = item.get("url", "")
#         content = item.get("content", "")
#         my_list.append({'content':content,'url':url})
    
#     #environmen variables
#     upstash_token = os.environ["Token"] 
#     upstash_url = os.environ["URL"]
    
#     index = Index(url=upstash_url, token=upstash_token) #initialize the vector index

#     #upserting vector data
#     for id, value in enumerate(my_list):
#         index.upsert(
#             vectors=[
#                     (f"{clientId}_{str(id)}", value['content'], {"client_id": clientId,"Data": value}),
#                 ],
#             namespace=clientId
#             )
    
#     return {
#         "Status": "success",
#         "message": "successfully generated embedding...",
#     }
    
# @stub.function()
# @web_endpoint(label="query",method="POST")
# def start_query(requestData : Dict):
#     from fastapi.responses import StreamingResponse
#     query = requestData["query"]
#     client= requestData["client"]
#     #res = Model.query_data.remote(query)
#     return {"message": "not allowed!"}
#     return StreamingResponse(Model.query_data.remote_gen(client,query), media_type="text/event-stream")

# @stub.cls(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url"),modal.Secret.from_name("open-ai-key")])
# class Model:
#     @build()
#     @enter()
#     def start_model(self):
        
#         from upstash_vector import Index
#         from openai import OpenAI
#         upstash_token = os.environ["Token"] 
#         upstash_url = os.environ["URL"]
#         self.index = Index(url=upstash_url, token=upstash_token)
#         open_ai_key = os.environ["open_ai_key"]
#         self.client = OpenAI(api_key=open_ai_key)
#         self.instructions = """enter instructions here"""
        
#     @method()
#     def query_data(self,client:str,query:str):
#         from fastapi.responses import StreamingResponse
#         result = self.index.query(
#             data=query,
#             top_k=3,
#             namespace=client,
#             include_vectors=False,
#             include_metadata=True
#         ) 
#         array_of_context = []
        
#         for chunk in result:
#             info=chunk.metadata.get("Data")
#             temp = {'url': info["url"] , 'content': info["content"]}
#             array_of_context.append(temp)
            
         
#         page1 = [array_of_context[0]["url"] , array_of_context[0]["content"]]
#         page2 = [array_of_context[1]["url"] , array_of_context[1]["content"]]

        
#         data = f"<message><query>{query}</query><chunks><page><url>{page1[0]}</url><content>{page1[1]}</content></page><page><url>{page2[0]}</url><content>{page2[1]}</content></page></chunks></message>" 
#         print(data)
#         for chunk in self.client.chat.completions.create(
#                        model="gpt-3.5-turbo",
#                        messages=[{"role": "system", "content": self.instructions},{"role": "user", "content": data}],
#                        stream=True,
#                        ):
#             content = chunk.choices[0].delta.content
#             if content is not None:
#                print(content, end="")
#                yield content