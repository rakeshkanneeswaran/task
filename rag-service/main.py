from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json
import requests

from services.embedding_service import EmbeddingService
from services.vector_store_service import VectorStoreService
from services.llm_service import LLMService
import uvicorn
# from services.llm_service import LLMService


active_vectore_stores = {}

app = FastAPI()


@app.websocket("/ws/rag-service/{userId}")
async def websocket_endpoint(websocket: WebSocket, userId: str):
    await websocket.accept()
    print(f"User {userId} connected")
    response = requests.get("http://localhost:3000")
    content = response.json()
    print("printhing", content)
    # create the vector store
    vectorStore = EmbeddingService.createVectorStore(content["data"])
    active_vectore_stores[userId] = vectorStore
    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            request_type = data["request_type"]

            # Only handle query requests via WebSocket
            if request_type == "query":
                # Check if the vector store is already loaded
                if userId in active_vectore_stores:
                    vectorStore = active_vectore_stores[userId]
                    context = VectorStoreService.retrieveText(
                        vectorStore, data["query"]
                    )

                    llm_answer = LLMService.generateResponse(
                        context, str(data["query"])
                    )
                    await websocket.send_text(json.dumps(llm_answer))

    except WebSocketDisconnect:
        print(f"User {userId} disconnected.")
        # Keep vector store in memory for HTTP requests


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3004, reload=True)
