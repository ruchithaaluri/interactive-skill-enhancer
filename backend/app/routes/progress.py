from fastapi import APIRouter, Header, Body
from app.utils.jwt_handler import decode_access_token
from app.database.mongodb import get_user_progress, log_interaction_event

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)

@router.get("/")
async def get_progress(authorization: str = Header(None)):
    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            email = payload["sub"]

    progress_data = await get_user_progress(email)
    return progress_data

@router.post("/event")
async def record_event(payload: dict = Body(...), authorization: str = Header(None)):
    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        user_data = decode_access_token(token)
        if user_data and "sub" in user_data:
            email = user_data["sub"]

    event_type = payload.get("event_type", "activity_complete")
    details = payload.get("details", {})
    recorded = await log_interaction_event(email, event_type, details)
    return {"status": "success", "event": recorded}
