import psycopg2
import json
import os

def connect_to_db(DATABASE_URL):
    """
    Establishes a connection to the database using the DATABASE_URL environment variable.
    """
    try:
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable not set")
        
        conn = psycopg2.connect(DATABASE_URL)
        print("Database connection established successfully.")
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise


def upsert_scraped_data(conn, scraped_page_data, record_id):
    """
    Inserts or updates scraped page data in the database.
    """
    try:
        with conn.cursor() as cursor:
            update_query = """
            UPDATE indexes
            SET 
                content = %s
            WHERE id = %s;
            """
            json_content = json.dumps(scraped_page_data)
            cursor.execute(update_query, (
                json_content,
                record_id
            ))
        conn.commit()
        print("Scraped data upserted successfully.")
        return {"status": "success"}
    except Exception as e:
        conn.rollback()
        print(f"Failed to update the record: {e}")
        return {"status": "error", "message": str(e)}


def status_update(conn, record_id, status):
    """
    Updates the status of a record in the database.
    """
    try:
        with conn.cursor() as cursor:
            update_query = """
            UPDATE indexes
            SET 
                status = %s
            WHERE id = %s;
            """
            cursor.execute(update_query, (status, record_id))
        conn.commit()
        print(f"Status updated to {status} for record ID {record_id}.")
    except Exception as e:
        conn.rollback()
        return {f"Failed to update status: {e}"}
        raise



def function_call_id(conn, record_id, function_id):
    """
    Ensures the `function_call_id` column exists in the `indexes` table.
    Updates the `function_call_id` column with the given `function_call_id`.
    """
    try:
        with conn.cursor() as cursor:
            # Check if `scrape_call` column exists
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'indexes' AND column_name = 'function_call_id';
            """)
            if not cursor.fetchone():
                # Add `scrape_call` column if it doesn't exist
                cursor.execute("ALTER TABLE indexes ADD COLUMN function_call_id TEXT;")

            # Update the `scrape_call` column
            cursor.execute("""
                UPDATE indexes
                SET function_call_id = %s
                WHERE id = %s;
            """, (function_id, record_id))

        # Commit the changes
        conn.commit()

    except Exception as e:
        conn.rollback()
        raise Exception(f"Failed to update function_call_id: {str(e)}")
    
def credit_table_update(conn, index_id, user_email):

    try:
        with conn.cursor() as cursor:
            # Check if the row with the given index_id exists
            check_query = "SELECT 1 FROM credits WHERE index_id = %s;"
            cursor.execute(check_query, (index_id,))
            row_exists = cursor.fetchone()

            if row_exists:
                # Row exists, no update needed
                print("Row exists. No update needed.")
                return {"status": "success", "message": "Row exists. No update needed."}
            else:
                # Row does not exist, insert new row
                insert_query = """
                INSERT INTO credits (index_id, total_requests , user_email)
                VALUES (%s, %s, %s);
                """
                cursor.execute(insert_query, (index_id,0, user_email))
                conn.commit()
                print("New row inserted successfully.")
                return {"status": "success", "message": "New row inserted successfully."}
    except Exception as e:
        conn.rollback()
        print(f"Failed to insert new row: {e}")
        return {"status": "error", "message": str(e)}





    




    