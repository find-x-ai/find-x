from modal import App, build, enter, method, web_endpoint, Image
from typing import Dict
import os
import modal
from upstash_vector import Index
from upstash_redis import Redis
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
    client_id = requestData["client"]
    secret_key = requestData["secret"]
    store_url = requestData["store_url"]

    process_key = f"process_{client_id}"
    
    if secret_key != key:
        return {"error": "Invalid upsert key!"}

    # Initialize Redis client for logging
    upstash_redis_url = os.environ["UPSTASH_URL"]
    upstash_redis_password = os.environ["UPSTASH_PASSWORD"]
    redis = Redis(url=upstash_redis_url, token=upstash_redis_password)

    try:
        response = requests.get(store_url, params={"id": client_id}, headers={"Authorization": f"Bearer {key}"})
        if not response.ok:
            raise Exception(f"Failed to fetch data: {response.status_code} - {response.text}")
        
        data = response.json()
        if "data" not in data:
            raise Exception("Invalid response format: missing 'data' field")
            
        pages_data = data["data"]
        
        upsert_url = os.environ["UPSERT_URL"]
        
        # Process data in batches
        BATCH_SIZE = 10
        total_batches = (len(pages_data) + BATCH_SIZE - 1) // BATCH_SIZE
        total_processed = 0

        for i in range(0, len(pages_data), BATCH_SIZE):
            batch = pages_data[i:i + BATCH_SIZE]
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
            current_batch = i // BATCH_SIZE + 1
            
            # Calculate percentage between 80-100 based on batch progress
            percentage = 80 + int((current_batch / total_batches) * 20)
            
            # Get existing state and update only the percentage
            current_state = json.loads(redis.get(process_key) or "{}")
            current_state["percentage"] = percentage
            redis.set(process_key, json.dumps(current_state))

        return {
            "status": "success",
            "message": f"Successfully processed {len(pages_data)} pages",
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }