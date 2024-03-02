from modal import Image, Secret

import modal
image = Image.debian_slim().pip_install(
    "sentence_transformers",
)
stub = modal.Stub(name="find-x", image=image)

@stub.function(keep_warm=3)
def generate_embedding(name: str):
    from sentence_transformers import SentenceTransformer
    
    MODEL = "multi-qa-MiniLM-L6-cos-v1"
    model = SentenceTransformer(MODEL, device="cpu")
    
    res = model.encode("this is demo")
    print(res)
