from modal import App, web_endpoint, Image, current_function_call_id
import modal
from typing import Dict
import os
import json
from upstash_vector import Index, Vector
from upstash_redis import Redis
from neon_db import connect_to_db, function_call_id

image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "pip install upstash_vector",
    "pip install upstash-redis",
    "pip install psycopg2-binary"
)

app = App(name="upsert", image=image)

@app.function(secrets=[modal.Secret.from_name("upstash"), modal.Secret.from_name("Database"), modal.Secret.from_name("server")], timeout=3600)
@web_endpoint(label="upsert", method="POST")
def generate_embedding(request: Dict):
    # Load secrets from environment variables
    upsert_secret = os.environ["UPSERT_SECRET"]
    secret_key = request["secret_key"]
    if secret_key != upsert_secret:
        raise ValueError("Invalid secret key")
    
    client_id = request["client"]
    data = request["data"]
    vector_ids = request.get("vector_ids", [])
    incoming_vector_ids = set(f"{client_id}-{chunk['url']}" for chunk in (data or []))
    filtered_vector_ids = [vector_id for vector_id in vector_ids if vector_id not in incoming_vector_ids]

    print("Filtered Vector IDs:", filtered_vector_ids)

    # Load database URL from environment variables
    upsert_url = os.environ["UPSERT_VECTOR_URL"]
    upsert_pass = os.environ["UPSERT_VECTOR_PASS"]
    database_url = os.environ["DATABASE_URL"]
    process_key = f"process_{client_id}"

    # Connect to the database and log the function call
    conn = connect_to_db(database_url)
    function_call_id(conn, client_id, current_function_call_id())

    # Initialize Redis client for logging
    upstash_redis_url = os.environ["UPSTASH_REDIS_URL"]
    upstash_redis_password = os.environ["UPSTASH_REDIS_PASS"]
    redis = Redis(url=upstash_redis_url, token=upstash_redis_password)

    # Initialize Upstash Index for vector operations
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
        
        # Handle filtered vector IDs
        try:
            if filtered_vector_ids:
                index.delete(ids=filtered_vector_ids)
        except Exception as e:
            print(f"Error deleting filtered vector IDs: {e}")

        # Delete client-specific keys in Redis
        try:
            keys = redis.keys(f"<{client_id}>:*")
            if keys:
                redis.delete(*keys)
        except Exception as e:
            print(f"Error deleting Redis keys: {e}")

        return {
            "status": "success",
            "message": f"Successfully processed {total_processed} pages"
        }

    except Exception as e:
        print(f"Error occurred: {e}")
        return {
            "status": "error",
            "message": str(e),
        }
