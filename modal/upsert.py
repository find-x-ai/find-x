from modal import App, build, enter, method, web_endpoint, Image
from typing import Dict
import os
import modal
from upstash_vector import Index
from upstash_redis import Redis
import time
import requests
import json
from datetime import datetime

image = Image.debian_slim().pip_install(
    "upstash_vector",
    "upstash-redis"
)
app = App(name="upsert", image=image)

@app.function(secrets=[modal.Secret.from_name("upstash")], timeout=300)
@web_endpoint(label="upsert", method="POST")
def generate_embedding(requestData: Dict):
    key = os.environ["AUTH"]
    data = requestData["data"]
    client_id = requestData["client"]
    secret_key = requestData["secret"]
    
    if secret_key != key:
        return {"error": "Invalid upsert key!"}

    # Initialize Redis client for logging
    upstash_redis_url = os.environ["UPSTASH_URL"]
    upstash_redis_password = os.environ["UPSTASH_PASSWORD"]
    redis = Redis(url=upstash_redis_url, token=upstash_redis_password)
    
    def log_event(type: str, message: str, client_id: str):
        # Create log entry matching the frontend's expected format
        log_entry = json.dumps({
            "tag": type,  # Changed from 'type' to 'tag' to match frontend
            "message": message,
            "timestamp": datetime.utcnow().isoformat()  # Changed to ISO string format
        })
        log_key = f"process_logs:{client_id}"
        redis.lpush(log_key, log_entry)
        redis.ltrim(log_key, 0, 999)  # Keep only the last 1000 logs

    try:
        log_event("info", f"Starting upserting...", client_id)
        log_event("info", f"Processing {len(data)} pages", client_id)
        
        upsert_url = os.environ["UPSERT_URL"]
        
        # Define batch size
        BATCH_SIZE = 100
        total_processed = 0
        
        # Process data in batches
        for i in range(0, len(data), BATCH_SIZE):
            batch = data[i:i + BATCH_SIZE]
            response = requests.post(
                upsert_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {key}"
                },
                json={
                    "client": client_id,
                    "data": batch
                }
            )
            
            if not response.ok:
                raise Exception(f"Upsert failed with status {response.status_code}: {response.text}")
            
            total_processed += len(batch)
            log_event("info", f"Processed batch: {total_processed}/{len(data)} pages", client_id)

        log_event("success", f"Successfully processed all {len(data)} pages", client_id)
        return {
            "status": "success",
            "message": f"Successfully processed {len(data)} pages",
        }
    except Exception as e:
        log_event("error", f"Upsert failed: {str(e)}", client_id)
        return {
            "status": "error",
            "message": str(e),
        }