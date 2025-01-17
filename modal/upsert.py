from modal import App, web_endpoint, Image,current_function_call_id
import modal
from typing import Dict
import os
import modal
from upstash_vector import Index,Vector
from upstash_redis import Redis
import json
from neon_db import connect_to_db , function_call_id


image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "pip install upstash_vector",
    "pip install upstash-redis",
    "pip install psycopg2-binary"
)

app = App(name="upsert", image=image)

@app.function(secrets=[modal.Secret.from_name("upstash"),modal.Secret.from_name("Database"), modal.Secret.from_name("server")], timeout=3600)
@web_endpoint(label="upsert", method="POST")
def generate_embedding(request: Dict):
    # load secrets from environment variables
    upsert_secret = os.environ["UPSERT_SECRET"]
    secret_key = request['secret_key']
    if secret_key != upsert_secret:
        raise ValueError("Invalid secret key")
    
    client_id = request["client"]
    data=request["data"]

    # load database url from environment variables
    upsert_url = os.environ["UPSERT_VECTOR_URL"]
    upsert_pass=os.environ["UPSERT_VECTOR_PASS"]
    Database_url=os.environ["DATABASE_URL"]

    process_key = f"process_{client_id}"


    #Taking upserting Function id 
    conn=connect_to_db(Database_url)
    function_call_id(conn,client_id,current_function_call_id())

    # Initialize Redis client for logging
    upstash_redis_url = os.environ["UPSTASH_REDIS_URL"]
    upstash_redis_password = os.environ["UPSTASH_REDIS_PASS"]

    # Initialize Upstash Index and Redis for logging progress
    redis = Redis(url=upstash_redis_url, token=upstash_redis_password)
    index = Index(url=upsert_url, token=upsert_pass)
    

    try:
        # Validate incoming data structure
        if not data or not isinstance(data, list):
            raise Exception("Invalid data format: 'data' field must be a non-empty list")

        # Batch processing configuration
        BATCH_SIZE = 10
        total_batches = (len(data) + BATCH_SIZE - 1) // BATCH_SIZE
        total_processed = 0

        for i in range(0, len(data), BATCH_SIZE):
            batch = data[i:i + BATCH_SIZE]

            # Prepare vectors for the batch
            vectors = [
               (
                    f"{client_id}-{chunk['url']}",
                        chunk["content"],
                        {
                        "namespace": client_id,
                        "title": chunk["title"],
                        "client": client_id,
                        "url": chunk["url"],
                        "images": json.dumps(chunk["images"]),
                    }
                )
                for chunk in batch
            ]

            # Upsert the batch of vectors
            index.upsert(vectors=vectors)

            total_processed += len(batch)
            current_batch = i // BATCH_SIZE + 1

            # Update progress in Redis (80-100% range)
            percentage = 80 + int((current_batch / total_batches) * 20)
            current_state = json.loads(redis.get(process_key) or "{}")
            current_state["percentage"] = percentage
            redis.set(process_key, json.dumps(current_state))

        return {
            "status": "success",
            "message": f"Successfully processed {total_processed} pages"
           
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }
