import modal

def start_embedding():
    f = modal.Function.lookup("find-x", "generate_embedding")
    print("Starting embedding...")
    result = f.remote()
    
    return result
    

