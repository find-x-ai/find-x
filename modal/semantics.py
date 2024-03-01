import modal

stub = modal.Stub("find-x")

@stub.function()
def generate_embedding(name: str):
    print("Generating embedding...")
    return {
        "status": True,
        "message": "embedding working " + name
    }
