import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_farmer_registration_and_login():
    # 1. Register a test farmer in Guntur district (Tenali mandal)
    unique_phone = "9876543210"
    payload = {
        "phone_number": unique_phone,
        "password": "StrongPassword123",
        "full_name": "Rao Venkata",
        "role": "farmer",
        "profile": {
            "state": "Andhra Pradesh",
            "district": "Guntur",
            "mandal": "Tenali",
            "village": "Angalakuduru",
            "preferred_language": "te",
            "total_acreage": "4.5",
            "irrigation_source": "Canal",
            "farm_location": {
                "longitude": 80.6480,
                "latitude": 16.2430
            }
        }
    }

    reg_res = client.post("/api/v1/auth/register", json=payload)
    # Status should be 201 Created or 409 Conflict if already seeded
    assert reg_res.status_code in [201, 409]

    # 2. Test Login
    login_data = {
        "username": unique_phone,
        "password": "StrongPassword123"
    }
    login_res = client.post("/api/v1/auth/login", data=login_data)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    access_token = token_data["access_token"]

    # 3. Test Protected Profile Route with Bearer Token
    headers = {"Authorization": f"Bearer {access_token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["phone_number"] == unique_phone
    assert me_data["profile"]["mandal"] == "Tenali"
    assert round(me_data["profile"]["latitude"], 3) == 16.243
    assert round(me_data["profile"]["longitude"], 3) == 80.648