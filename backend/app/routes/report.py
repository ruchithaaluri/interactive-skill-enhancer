from fastapi import APIRouter, HTTPException, Header, Response, Query
from app.utils.jwt_handler import decode_access_token
from app.database.mongodb import get_child_profile, get_user_progress
from app.services.report_service import generate_child_observational_report

router = APIRouter(
    prefix="/report",
    tags=["Report"]
)

@router.get("/pdf")
async def download_pdf_report(days: int = Query(7, ge=1, le=365), authorization: str = Header(None)):
    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            email = payload["sub"]

    profile = await get_child_profile(email)
    progress = await get_user_progress(email)

    pdf_bytes = generate_child_observational_report(profile, progress, [], days=days)

    filename = f"Observational_Report_{email.split('@')[0]}_{days}d.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
