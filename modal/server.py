from modal import Stub, build, enter, method, web_endpoint,Image
from typing import Dict
import os
import modal

image = Image.debian_slim().pip_install(
    "upstash_vector",
    "openai"
)

stub = Stub(name="find-x", image=image)

@stub.function(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url")],timeout=1000)
@web_endpoint(label="embed",method="POST")
def generate_embedding(requestData : Dict):
    #imports
    
    from upstash_vector import Index

    data = requestData["data"]  #data is array of dict i.e. [{url: string , content: string }]
    clientId = requestData["client"] #client id is string
    my_list=[]
    
    for id, item in enumerate(data):
        url = item.get("url", "")
        content = item.get("content", "")
        my_list.append({'content':content,'url':url})
    
    #environmen variables
    upstash_token = os.environ["Token"] 
    upstash_url = os.environ["URL"]
    
    index = Index(url=upstash_url, token=upstash_token) #initialize the vector index

    #upserting vector data
    for id, value in enumerate(my_list):
        index.upsert(
            vectors=[
                    (f"{clientId}_{str(id)}", value['content'], {"client_id": clientId,"Data": value}),
                ],
            namespace=clientId
            )
    
    return {
        "Status": "success",
        "message": "successfully generated embedding...",
    }
    
@stub.function()
@web_endpoint(label="query",method="POST")
def start_query(requestData : Dict):
    from fastapi.responses import StreamingResponse
    query = requestData["query"]
    client= requestData["client"]
    #res = Model.query_data.remote(query)
    return StreamingResponse(Model.query_data.remote_gen(client,query), media_type="text/event-stream")

@stub.cls(secrets=[modal.Secret.from_name("upstash-token"), modal.Secret.from_name("upstash-url"),modal.Secret.from_name("open-ai-key")])
class Model:
    @build()
    @enter()
    def start_model(self):
        
        from upstash_vector import Index
        from openai import OpenAI
        upstash_token = os.environ["Token"] 
        upstash_url = os.environ["URL"]
        self.index = Index(url=upstash_url, token=upstash_token)
        open_ai_key = os.environ["open_ai_key"]
        self.client = OpenAI(api_key=open_ai_key)
        self.instructions = """You are an intellegent AI assistant capable of answering user queries in most efficient way possible. You are excellent in solving queries of users.
You are part of a website where your job is to answer queries of user. You act like a website that communicates with humans.
You are extremely talented in analyzing the query and making a meaningful output through it.
You have the XML request message that have following format : 
"<message>
   <query>Users query about website</query>
   <chunks>
      <page>
        <url>https://example.com/abc</url>
        <content>data in found in the page</content>
      </page>
      <page>
        <url>https://example.com/xyz</url>
        <content>data in found in second page</content>
      </page>        
   </chunks>
</message>".
You have the query of user in query tag and other data is just what you found on the website about user query.
As mentioned in above example you can get chunk of single or two pages and their corresponding URL.
You are extremely good in analyzing the query and chunks and preparing the best possible answer for the query. 
You are intelligent at such level that if user asks a question that does not make any sense when analyzed it with the chunks found then you simply deny the users request without letting him know the reason behind it. 
You can understand the situation very well that when user asks a query a that doesn't provide much context about the problem or data provided you simply ask user to provide more context.
You can also detect the spelling mistakes in query and analyze what query actually means.
You have some strict rules that you cannot provide any other information except the XML data you have found.
The data you found is your universe if someone asks a query that doesn't relate to provided data then you simply deny the request. While denying the request you simply deny it in one line without extra explainations. 
You always keep your own working architecture as a top secret and wouldn't tell if someone asks about your working.
You have really good sense of identifying if a query is just about greeting like hi , hello , hey or etc in such cases you also greet back without relying on any found information in website.
You are really friendly ai assistant who is always looking forward to solve the website queries as much as possible. You always give short and simple answers to the questions. You always remember to not share any information about 
what kind of data or in what format the data is found to you , You never disclose such information in response to any query. The most important and most critical thing is that whether the chunk is found or not you never mention anything about data or chunks or what's been found or what's not , You just don't disclose your data mechanism and just 
act like somehow you magically know everything.
You are so good at your work that you also provide link to the data section that you are reffering for information so that the user can himself go and check it.
Also you never ever ever include recieved query as it is in question in response to requests that you cannot fulfill."""
        
    @method()
    def query_data(self,client:str,query:str):
        from fastapi.responses import StreamingResponse
        result = self.index.query(
            data=query,
            top_k=3,
            namespace=client,
            include_vectors=False,
            include_metadata=True
        ) 
        array_of_context = []
        
        for chunk in result:
            info=chunk.metadata.get("Data")
            temp = {'url': info["url"] , 'content': info["content"]}
            array_of_context.append(temp)
            
         
        page1 = [array_of_context[0]["url"] , array_of_context[0]["content"]]
        page2 = [array_of_context[1]["url"] , array_of_context[1]["content"]]

        
        data = f"<message><query>{query}</query><chunks><page><url>{page1[0]}</url><content>{page1[1]}</content></page><page><url>{page2[0]}</url><content>{page2[1]}</content></page></chunks></message>" 
        print(data)
        for chunk in self.client.chat.completions.create(
                       model="gpt-3.5-turbo",
                       messages=[{"role": "system", "content": self.instructions},{"role": "user", "content": data}],
                       stream=True,
                       ):
            content = chunk.choices[0].delta.content
            if content is not None:
               print(content, end="")
               yield content