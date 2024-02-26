from fastapi import FastAPI, HTTPException, Response
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from scraper import scrape_website

app = FastAPI()

# Allowing CORS to make the API accessible from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def stream_chunks():
    async for chunk in scrape_website("https://bun.sh"):
        yield f"data: {chunk}\n\n"

@app.get('/')
async def home():
    return StreamingResponse(stream_chunks(), media_type="text/event-stream")
