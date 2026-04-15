from qdrant_client import QdrantClient
from workerchat.config import settings

client = QdrantClient(
    url=settings.QDRANT_URL,
    prefer_grpc=False,
)