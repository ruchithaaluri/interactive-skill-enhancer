import sys
import os
import json

# Ensure UTF-8 output encoding for Windows PowerShell stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


from app.services.mistral_service import (
    generate_response,
    generate_quiz_questions,
    evaluate_quiz_answer
)

def run_proof_tests():
    print("==================================================")
    print("         RUNTIME PROOF SUITE EXECUTION            ")
    print("==================================================")

    # Test 1: Teacher Persona Greeting
    t1_resp = generate_response("hi", history=[], avatar_id="teacher")
    print(f"\n[TEST 1 - Teacher Persona Greeting]\nQuery: 'hi'\nResponse: {t1_resp}")
    assert "Dr." not in t1_resp, "Teacher should NOT mention Dr.!"
    assert "Ms. Mentor" in t1_resp or "teacher" in t1_resp.lower(), "Teacher introduction missing!"

    # Test 2: Friend Persona Greeting
    t2_resp = generate_response("hi", history=[], avatar_id="friend")
    print(f"\n[TEST 2 - Friend Persona Greeting]\nQuery: 'hi'\nResponse: {t2_resp}")
    assert "Dr." not in t2_resp, "Friend should NOT mention Dr.!"
    assert "Alex" in t2_resp or "friend" in t2_resp.lower(), "Friend introduction missing!"

    # Test 3: Emotional Query - "I had a bad day"
    t3_resp = generate_response("I had a bad day", history=[], avatar_id="friend")
    print(f"\n[TEST 3 - Emotional Response (Friend)]\nQuery: 'I had a bad day'\nResponse: {t3_resp}")

    # Test 4: Regression Test for NLP Routing Bug ("What should I do tomorrow?")
    t4_resp = generate_response("What should I do tomorrow?", history=[], avatar_id="tutor")
    print(f"\n[TEST 4 - NLP Routing Regression Test ('What should I do tomorrow?')]\nQuery: 'What should I do tomorrow?'\nResponse: {t4_resp}")
    assert "Gabrielle Zevin" not in t4_resp, "REGRESSION BUG: 'tomorrow' query incorrectly returned book entry!"
    assert "Tomorrow, and Tomorrow, and Tomorrow" not in t4_resp, "REGRESSION BUG: 'tomorrow' query matched novel title!"

    # Test 5: Explicit Book Query Should Legitely Work
    t5_resp = generate_response("Who wrote the novel Tomorrow, and Tomorrow, and Tomorrow?", history=[], avatar_id="teacher")
    print(f"\n[TEST 5 - Explicit Book Query]\nQuery: 'Who wrote the novel Tomorrow, and Tomorrow, and Tomorrow?'\nResponse: {t5_resp}")
    assert "Zevin" in t5_resp or "Knowledge Base" in t5_resp or "novel" in t5_resp.lower(), "Explicit book query should return book info!"

    # Test 6: Multi-Turn Conversation Memory Test (Mathematics)
    hist_math = [
        {"role": "user", "content": "I failed my mathematics test."},
        {"role": "assistant", "content": "I'm sorry today was challenging! We can practice step-by-step."}
    ]
    t6_resp = generate_response("What did I tell you I struggled with?", history=hist_math, avatar_id="teacher")
    print(f"\n[TEST 6 - Memory Recall (Math)]\nQuery: 'What did I tell you I struggled with?'\nResponse: {t6_resp}")
    assert "Math" in t6_resp or "Mathematics" in t6_resp, f"Memory recall failed! Expected Math/Mathematics, got: {t6_resp}"

    # Test 7: Multi-Turn Conversation Memory Test (Physics)
    hist_physics = [
        {"role": "user", "content": "I am preparing for physics."},
        {"role": "assistant", "content": "Great! Physics is fascinating!"}
    ]
    t7_resp = generate_response("What subject did I just tell you I am preparing for?", history=hist_physics, avatar_id="tutor")
    print(f"\n[TEST 7 - Memory Recall (Physics)]\nQuery: 'What subject did I just tell you I am preparing for?'\nResponse: {t7_resp}")
    assert "Physics" in t7_resp or "physics" in t7_resp.lower(), f"Memory recall failed! Expected Physics, got: {t7_resp}"

    # Test 8: Factual Science Explanation - "What is photosynthesis?"
    t8_resp = generate_response("What is photosynthesis?", history=[], avatar_id="teacher")
    print(f"\n[TEST 8 - Factual Science Answer]\nQuery: 'What is photosynthesis?'\nResponse: {t8_resp}")
    assert "photosynthesis" in t8_resp.lower() or "sunlight" in t8_resp.lower(), "Photosynthesis explanation missing!"

    # Test 9: Math Calculation - "What is 27 * 8?"
    t9_resp = generate_response("What is 27 * 8?", history=[], avatar_id="shopkeeper")
    print(f"\n[TEST 9 - Math Calculation]\nQuery: 'What is 27 * 8?'\nResponse: {t9_resp}")
    assert "216" in t9_resp, f"Math calculation failed! Expected 216, got: {t9_resp}"

    # Test 10: Quiz System Generation & Evaluation
    questions = generate_quiz_questions("Science", "Solar System", count=3)
    print(f"\n[TEST 10 - Quiz Generation]\nGenerated {len(questions)} questions. Sample question: {questions[0]['question']}")

    eval_result = evaluate_quiz_answer(
        question=questions[0]["question"],
        user_answer=questions[0]["correct_answer"],
        correct_answer=questions[0]["correct_answer"],
        explanation=questions[0]["explanation"]
    )
    print(f"[TEST 10 - Quiz Evaluation]\nUser Answer: {questions[0]['correct_answer']} (Correct)\nAvatar Speech: {eval_result['avatar_response']}\nAvatar State: {eval_result['avatar_state']}")

    # Test 11: No "Dr." leak in any non-doctor persona greeting
    personas_to_check = ["teacher", "friend", "colleague", "counsellor", "shopkeeper", "tutor", "mentor", "guide", "support"]
    for p in personas_to_check:
        res = generate_response("hi", history=[], avatar_id=p)
        assert "Dr." not in res and "doctor" not in res.lower(), f"Unwanted Dr. leak in persona {p}: {res}"

    print("\n==================================================")
    print("      ALL RUNTIME PROOF TESTS PASSED 100%!        ")
    print("==================================================")

if __name__ == "__main__":
    run_proof_tests()
