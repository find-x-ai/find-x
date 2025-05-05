import os
import modal
from modal import App
import requests
from typing import Dict
from neon_db import connect_to_db, upsert_scraped_data, status_update, credit_table_update, get_upserted_ids
from upstash_vector import Index

# Modal setup
image = modal.Image.debian_slim(python_version="3.10").run_commands(
    "pip install requests",
    "pip install psycopg2-binary",
    "pip install upstash_vector",
)

image_with_neon_db = image.add_local_python_source("neon_db")

app = App(name="Central-server", image=image_with_neon_db)

@app.function(secrets=[modal.Secret.from_name("Database"), modal.Secret.from_name("server"), modal.Secret.from_name("upstash")], timeout=3600)
@modal.fastapi_endpoint(label="central-server", method="POST")
async def api_call(request: Dict):
    """
    Handles scraping and upserting requests with robust error handling.
    Ensures status is set to 'failed' for any errors during the process.
    """
    conn = None
    try:
        # Request header
        secret_key = request['secret_key']
        server_secret = os.environ["SERVER_SECRET"]
        vector_url = os.environ["UPSERT_VECTOR_URL"]
        vector_pass = os.environ["UPSERT_VECTOR_PASS"]

        if secret_key != server_secret:
            raise ValueError("Invalid secret key")
            
        # Extract and validate input data
        url = request.get("url")
        process_id = request.get("id")
        scrape_api = request.get("scrape_api")
        upsert_api = request.get("upsert_api")
        max_url = request.get("max_url", None)
        user_email = request.get("user_email")
        redeploy = request.get("redeploy", False)

        # Load database URL from environment variables
        database_url = os.environ["DATABASE_URL"]

        # Load secrets from environment variables
        crawl_secret = os.environ["CRAWL_SECRET"]
        upsert_secret = os.environ["UPSERT_SECRET"]

        if not url or not process_id:
            raise ValueError("Missing required fields in the input data.")

        # Establish database connection
        conn = connect_to_db(database_url)

        try:
            # Scraping phase
            input_data = {"url": url, "id": process_id, "max_url": max_url, "secret_key": crawl_secret}
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

            # Initialize ids
            ids = []
            if redeploy:
                # Delete all the older indexes
                ids = get_upserted_ids(conn, process_id)
                if not ids:
                    raise Exception("No upserted ids found.")
            
            # Database upsertion phase
            upsert_result = upsert_scraped_data(conn, {"data": scrape_info["data"]}, process_id)
            if upsert_result.get("status") != "success":
                raise Exception("Database upsertion failed.")
                
            # Upstash upsertion phase
            upsert_payload = {"client": process_id, "data": scrape_info["data"], "secret_key": upsert_secret, "vector_ids": ids}
            upsert_response = requests.post(
                upsert_api,
                json=upsert_payload,
                headers={"Content-Type": "application/json"},
                timeout=3600
            )
            upstash_info = upsert_response.json()

            # Validate Upstash response
            if not upsert_response.ok or "error" in upstash_info or not upstash_info.get("message"):
                raise Exception(f"Upstash upsertion failed: {upstash_info.get('error', 'Unknown error')}")

            if "Expected a list" in upstash_info.get("message", ""):
                raise Exception(f"Upstash response error: {upstash_info.get('message')}")

            # Update status to success and credit table only after everything succeeds
            status_update(conn, process_id, "success")
            credit_table_update(conn, process_id, user_email)

            return {
                "status": "success",
                "scrape_message": "Scraping and database storage successful",
                "upsert_message": upstash_info.get("message", "Upsert completed successfully"),
            }

        except Exception as e:
            # Set failed status if we have a database connection and process_id
            if conn and process_id:
                status_update(conn, process_id, "failed")
            raise  # Re-raise the exception to be caught by outer try-except

    except Exception as e:
        error_message = str(e)
        print(error_message)
        # Ensure status is set to failed even for outer exceptions
        if conn and process_id:
            try:
                status_update(conn, process_id, "failed")
            except Exception as db_error:
                error_message = f"Original error: {error_message}. Failed to update status: {str(db_error)}"
        
        return {"status": "error", "message": error_message}

    finally:
        # Always close the database connection if it exists
        if conn:
            try:
                conn.close()
            except Exception:
                pass  # Suppress any connection closing errors
