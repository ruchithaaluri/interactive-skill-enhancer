from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, decode_access_token
from app.database.mongodb import get_user_by_email, save_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=TokenResponse)
async def register(user: UserRegister):
    existing = await get_user_by_email(user.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    hashed_pwd = hash_password(user.password)

    user_data = {
        "full_name": user.full_name,
        "email": user.email.lower(),
        "hashed_password": hashed_pwd
    }

    await save_user(user_data)

    token = create_access_token({"sub": user.email.lower(), "name": user.full_name})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            full_name=user.full_name,
            email=user.email.lower()
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    email = credentials.email.lower()
    user_record = await get_user_by_email(email)

    if not user_record:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(credentials.password, user_record.get("hashed_password", "")):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": email, "name": user_record.get("full_name", "Learner")})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            full_name=user_record.get("full_name", "Learner"),
            email=email
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_record = await get_user_by_email(payload["sub"])
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        full_name=user_record.get("full_name", "Learner"),
        email=user_record.get("email", payload["sub"])
    )