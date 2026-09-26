from fastapi import APIRouter, HTTPException, Header
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.mistral_service import generate_response
from app.utils.jwt_handler import decode_access_token
from app.database.mongodb import log_interaction_event

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, authorization: str = Header(None)):
    try:
        reply = generate_response(
            message=request.message,
            history=request.history
        )

        email = "demo@learner.com"
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            payload = decode_access_token(token)
            if payload and "sub" in payload:
                email = payload["sub"]

        # Log real interaction event
        await log_interaction_event(email, "chat", {
            "question": request.message,
            "response": reply[:100]
        })

        return ChatResponse(response=reply)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )