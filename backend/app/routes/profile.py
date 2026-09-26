from fastapi import APIRouter, HTTPException, Header
from app.schemas.user import ProfileSchema
from app.utils.jwt_handler import decode_access_token
from app.database.mongodb import get_child_profile, save_child_profile

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("/")
async def get_profile(authorization: str = Header(None)):
    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            email = payload["sub"]

    profile = await get_child_profile(email)
    return profile

@router.put("/")
async def update_profile(profile_data: ProfileSchema, authorization: str = Header(None)):
    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            email = payload["sub"]

    saved = await save_child_profile(email, profile_data.dict())
    return {
        "message": "Profile saved successfully",
        "profile": saved
    }
