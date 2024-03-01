from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
from upstash_vector import Index




def generate_embedding():
  MODEL = "multi-qa-MiniLM-L6-cos-v1"
  model = SentenceTransformer(MODEL)
  load_dotenv()
  Url = os.getenv("URL")
  Token = os.getenv("Token")
  index = Index(url=Url, token=Token)
  print("Generating embedding...")
  
 