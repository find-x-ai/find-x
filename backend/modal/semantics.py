import modal

stub = modal.Stub("find-x")

@stub.function()
def generate_embedding():
    print("Generating embedding...")
    return {
        "status": True,
        "message": "embedding working "
    }
