from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth
from app.routes.chatbot import router as chatbot_router
from app.routes.vision import router as vision_router
from app.routes.profile import router as profile_router
from app.routes.progress import router as progress_router
from app.routes.report import router as report_router
from app.database.mongodb import connect_to_mongodb

app = FastAPI(
    title="Interactive Skill Enhancer API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(chatbot_router)
app.include_router(vision_router)
app.include_router(profile_router)
app.include_router(progress_router)
app.include_router(report_router)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongodb()

# Home Route
@app.get("/")
async def home():
    return {
        "message": "Interactive Skill Enhancer Backend Connected Successfully!",
        "version": "1.0.0"
    }

# Health Check
@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }