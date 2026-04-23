from fastapi import FastAPI
from workerchat.main import app as chat_app
from workerimage.main import app as image_app
from workerimageeditor.main import app as image_editor_app
from workerimagestudio.main import app as image_studio_app
from workervideostudio.main import app as video_studio_app

app = FastAPI(title="Mahi AI Unified Worker")

app.mount("/chat-worker", chat_app)
app.mount("/image-worker", image_app)
app.mount("/image-editor-worker", image_editor_app)
app.mount("/image-studio-worker", image_studio_app)
app.mount("/video-studio-worker", video_studio_app)

@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "Unified worker running",
        "services": [
            "chat-worker",
            "image-worker",
            "image-editor-worker",
            "image-studio-worker",
            "video-studio-worker",
        ],
    }