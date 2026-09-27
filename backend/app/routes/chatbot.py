from fastapi import APIRouter, HTTPException, Header, Body
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.mistral_service import (
    generate_response,
    get_available_subjects_and_topics,
    generate_quiz_questions,
    evaluate_quiz_answer
)
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


@router.get("/topics")
async def get_topics():
    """Returns available subjects and their respective topics."""
    return get_available_subjects_and_topics()


@router.post("/quiz/generate")
async def generate_quiz(payload: dict = Body(...), authorization: str = Header(None)):
    """Generates a dynamic daily quiz for subject & topic."""
    subject = payload.get("subject", "Science")
    topic = payload.get("topic", "Solar System")
    count = payload.get("count", 5)

    questions = generate_quiz_questions(subject, topic, count=count)

    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        user_data = decode_access_token(token)
        if user_data and "sub" in user_data:
            email = user_data["sub"]

    await log_interaction_event(email, "quiz_started", {
        "subject": subject,
        "topic": topic,
        "questions_count": len(questions)
    })

    return {
        "subject": subject,
        "topic": topic,
        "questions": questions
    }


@router.post("/quiz/evaluate")
async def evaluate_quiz(payload: dict = Body(...), authorization: str = Header(None)):
    """Evaluates user quiz answer and provides doctor avatar response."""
    question = payload.get("question", "")
    user_answer = payload.get("user_answer", "")
    correct_answer = payload.get("correct_answer", "")
    explanation = payload.get("explanation", "")
    hint = payload.get("hint", "")

    result = evaluate_quiz_answer(
        question=question,
        user_answer=user_answer,
        correct_answer=correct_answer,
        explanation=explanation,
        hint=hint
    )

    email = "demo@learner.com"
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        user_data = decode_access_token(token)
        if user_data and "sub" in user_data:
            email = user_data["sub"]

    await log_interaction_event(email, "quiz_answer", {
        "question": question,
        "user_answer": user_answer,
        "is_correct": result["is_correct"]
    })

    return result