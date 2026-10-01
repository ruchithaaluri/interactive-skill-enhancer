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

    # Test 4: History Context - "Because I failed my math test"
    hist_4 = [
        {"role": "user", "content": "I had a bad day"},
        {"role": "assistant", "content": t3_resp}
    ]
    t4_resp = generate_response("Because I failed my math test.", history=hist_4, avatar_id="teacher")
    print(f"\n[TEST 4 - Contextual Follow-up (Teacher)]\nQuery: 'Because I failed my math test.'\nResponse: {t4_resp}")

    # Test 5: Contextual Guidance - "What should I do tomorrow?"
    hist_5 = hist_4 + [
        {"role": "user", "content": "Because I failed my math test."},
        {"role": "assistant", "content": t4_resp}
    ]
    t5_resp = generate_response("What should I do tomorrow?", history=hist_5, avatar_id="tutor")
    print(f"\n[TEST 5 - Contextual Guidance (Tutor)]\nQuery: 'What should I do tomorrow?'\nResponse: {t5_resp}")

    # Test 6: Scientific Explanation - "What is photosynthesis?"
    t6_resp = generate_response("What is photosynthesis?", history=[], avatar_id="teacher")
    print(f"\n[TEST 6 - Factual Science Answer]\nQuery: 'What is photosynthesis?'\nResponse: {t6_resp}")
    assert "photosynthesis" in t6_resp.lower() or "sunlight" in t6_resp.lower(), "Photosynthesis explanation missing!"

    # Test 7: Math Calculation - "What is 27 × 8?"
    t7_resp = generate_response("What is 27 * 8?", history=[], avatar_id="shopkeeper")
    print(f"\n[TEST 7 - Math Calculation]\nQuery: 'What is 27 * 8?'\nResponse: {t7_resp}")
    assert "216" in t7_resp, f"Math calculation failed! Expected 216, got: {t7_resp}"

    # Test 8: Quiz System Generation & Evaluation
    questions = generate_quiz_questions("Science", "Solar System", count=3)
    print(f"\n[TEST 8 - Quiz Generation]\nGenerated {len(questions)} questions. Sample question: {questions[0]['question']}")

    eval_result = evaluate_quiz_answer(
        question=questions[0]["question"],
        user_answer=questions[0]["correct_answer"],
        correct_answer=questions[0]["correct_answer"],
        explanation=questions[0]["explanation"]
    )
    print(f"[TEST 8 - Quiz Evaluation]\nUser Answer: {questions[0]['correct_answer']} (Correct)\nAvatar Speech: {eval_result['avatar_response']}\nAvatar State: {eval_result['avatar_state']}")

    # Test 9: No "Dr." leak in any non-doctor persona greeting
    personas_to_check = ["teacher", "friend", "colleague", "counsellor", "shopkeeper", "tutor", "mentor", "guide", "support"]
    for p in personas_to_check:
        res = generate_response("hi", history=[], avatar_id=p)
        assert "Dr." not in res and "doctor" not in res.lower(), f"Unwanted Dr. leak in persona {p}: {res}"

    print("\n==================================================")
    print("      ALL RUNTIME PROOF TESTS PASSED 100%!        ")
    print("==================================================")

if __name__ == "__main__":
    run_proof_tests()
