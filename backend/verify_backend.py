import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing Backend Endpoints...")

    # Root
    res = client.get("/")
    assert res.status_code == 200
    print("  [OK] GET / -> 200 OK")

    # Health
    res = client.get("/health")
    assert res.status_code == 200
    print("  [OK] GET /health -> 200 OK")

    # Auth Register
    res = client.post("/auth/register", json={
        "full_name": "Test Learner",
        "email": "test@learner.com",
        "password": "Password123!"
    })
    assert res.status_code in [200, 400]
    print(f"  [OK] POST /auth/register -> {res.status_code}")

    # Auth Login
    res = client.post("/auth/login", json={
        "email": "test@learner.com",
        "password": "Password123!"
    })
    assert res.status_code == 200
    token = res.json()["access_token"]
    print("  [OK] POST /auth/login -> 200 OK Token Received")

    headers = {"Authorization": f"Bearer {token}"}

    # Auth Me
    res = client.get("/auth/me", headers=headers)
    assert res.status_code == 200
    print("  [OK] GET /auth/me -> 200 OK")

    # Chatbot
    res = client.post("/chatbot/", json={
        "message": "Explain linear algebra simply",
        "history": []
    })
    assert res.status_code == 200
    assert "response" in res.json()
    print("  [OK] POST /chatbot/ -> 200 OK Response Received")

    # Vision Status
    res = client.get("/vision/status")
    assert res.status_code == 200
    print("  [OK] GET /vision/status -> 200 OK")

    # Vision Predict
    res = client.post("/vision/predict", json={
        "image": "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    })
    assert res.status_code == 200
    print("  [OK] POST /vision/predict -> 200 OK")

    # Profile
    res = client.get("/profile/", headers=headers)
    assert res.status_code == 200
    print("  [OK] GET /profile/ -> 200 OK")

    # Progress
    res = client.get("/progress/", headers=headers)
    assert res.status_code == 200
    print("  [OK] GET /progress/ -> 200 OK")

    print("\n>>> ALL BACKEND ENDPOINTS VERIFIED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_endpoints()
