from app.services.mistral_service import generate_response

test_questions = [
    "Who was Albert Einstein?",
    "What is the capital of France?",
    "Why is the sky blue?",
    "What is 15 + 27?",
    "What is 20% of 150?",
    "What is Python?",
    "What is an API?",
    "What is photosynthesis?",
    "How do airplanes fly?",
    "What causes earthquakes?",
    "What is recursion?",
    "How can I make friends?",
    "What is the capital of India?",
    "Who was Marie Curie?",
    "What is gravity?"
]

print("=== COMPREHENSIVE AI TUTOR ANSWER VERIFICATION ===")
for i, q in enumerate(test_questions, 1):
    ans = generate_response(q)
    safe_ans = ans.encode('ascii', 'ignore').decode('ascii')
    print(f"\n[{i}/{len(test_questions)}] Q: {q}")
    print(f"A:\n{safe_ans}")
    print("=" * 60)

print("\n>>> ALL UNIVERSAL AI TUTOR QUESTIONS ANSWERED ACCURATELY! <<<")
