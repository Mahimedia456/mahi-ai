from fastapi import FastAPI
from sentence_transformers import SentenceTransformer

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

@app.post("/embed")
async def embed(data: dict):

    texts = data.get("texts", [])

    vectors = model.encode(texts).tolist()

    return {
        "vectors": vectors
    }