import numpy as np
import pandas as pd
from dotenv import load_dotenv
import os
from upstash_vector import Index

load_dotenv()
Url = os.getenv("URL")
Token = os.getenv("Token")
index = Index(url=Url, token=Token)

def generate_embedding():
  print("Generating embedding...")
  
 