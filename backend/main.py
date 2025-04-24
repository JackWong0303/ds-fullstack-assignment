from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal, Optional, Dict, Any
from pydantic import BaseModel
from services.response import ResponseService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    type: Literal["text", "file", "image"]
    message: Optional[str] = None
    fileInfo: Optional[Dict[str, Any]] = None


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(
    request: ChatRequest,
    response_service: ResponseService = Depends(ResponseService),
):
    if request.type == "text":
        return response_service.generate_response({"message": request.message})

    # only text is currently supported
    msg = [
        f"Received {request.type} request,",
        "but only text is currently supported",
    ]
    return {"response": " ".join(msg)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
