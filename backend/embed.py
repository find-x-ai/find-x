import modal

def start_embedding(name: str):
    f = modal.Function.lookup("find-x", "generate_embedding")
    result = f.remote(name)
    return result
    

