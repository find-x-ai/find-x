import psycopg2
import json
import os
import modal
from modal import App, current_function_call_id
import requests
from typing import Dict
from neon_db import connect_to_db, upsert_scraped_data, status_update, function_call_id

# Modal setup
image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "pip install requests",
    "pip install psycopg2-binary"
)

app = App(name="Central-server", image=image)

@app.function(secrets=[modal.Secret.from_name("Database")], timeout=3600)
@modal.web_endpoint(label="central-server", method="POST")
async def api_call(request: Dict):
    """
    Handles scraping and upserting requests.
    Updates the status to `deploying` after successful scraping and Neon DB upsertion,
    or `failed` if upserting to Upstash fails.
    """
    try:
        # Extract and validate input data
        url = request.get("url")
        secret_key = request.get("secret_key")
        process_id = request.get("id")
        scrape_api = request.get("scrape_api")
        upsert_api = request.get("upsert_api")
        max_url = request.get("max_url",None)
        database_url = os.environ["DATABASE_URL"]

        if not url or not secret_key or not process_id:
            raise ValueError("Missing required fields in the input data.")

        input_data = {"url": url, "id": process_id, "secret_key": secret_key , "max_url":max_url}

        # Call the scraping API
        scrape_response = requests.post(
            scrape_api,
            json=input_data,
            headers={"Content-Type": "application/json"},
            timeout=3600
        )
        scrape_info = scrape_response.json()
        if not scrape_response.ok or scrape_info.get("error") or not scrape_info.get("data"):
            error_msg = scrape_info.get("error", "No data returned")
            raise Exception(f"Scraping failed: {error_msg}")

        # Update scrape function call ID in the database
        conn = connect_to_db(database_url)
        

        # Store scraped data in Neon DB
        upsert_result = upsert_scraped_data(conn, {"data": scrape_info["data"]}, process_id)
        if upsert_result.get("status") != "success":
            status_update(conn, process_id, "failed")
            conn.close()
            raise Exception("Database upsertion failed.")

        # Update status to `deploying`
        status_update(conn, process_id, "deploying")

        # Call the Upstash API
        upsert_payload = {"client": process_id, "secret": secret_key, "data": scrape_info["data"]}
        upsert_response = requests.post(
            upsert_api,
            json=upsert_payload,
            headers={"Content-Type": "application/json"},
            timeout=3600
        )

        upstash_info = upsert_response.json()

       

        # Check for HTTP or logical errors in Upstash response
        if not upsert_response.ok or "error" in upstash_info or not upstash_info.get("message"):
            status_update(conn, process_id, "failed")
            conn.close()
            raise Exception(f"Upstash upsertion failed: {upstash_info.get('error', 'Unknown error')}")

        if "Expected a list" in upstash_info.get("message", ""):
            status_update(conn, process_id, "failed")
            conn.close()
            raise Exception(f"Upstash response error: {upstash_info.get('message')}")

        # Update status to `success` upon successful upsertion
        status_update(conn, process_id, "success")
        conn.close()

        return {
            "status": "success",
            "scrape_message": "Scraping and database storage successful",
            "upsert_message": upstash_info.get("message", "Upsert completed successfully"),
        }

    except Exception as e:
        # Log error and return response
        return {"status": "error", "message": str(e)}

