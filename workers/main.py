from fastapi import FastAPI
from workerchat.main import app as chat_app
from workerimage.main import app as image_app

app = FastAPI(title="Mahi AI Unified Worker")

app.mount("/chat-worker", chat_app)
app.mount("/image-worker", image_app)

@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "Unified worker running"
    }