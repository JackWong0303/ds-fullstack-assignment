from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_chat_endpoint_text():
    response = client.post("/api/chat", json={"type": "text", "message": "hi"})
    assert response.status_code == 200
    assert response.json() == {"response": "hello there"}


def test_chat_endpoint_text_default():
    response = client.post(
        "/api/chat",
        json={"type": "text", "message": "hello world"},
    )
    assert response.status_code == 200
    assert response.json() == {"response": "I'm a rule-based bot"}


def test_chat_endpoint_non_text():
    response = client.post(
        "/api/chat", json={"type": "file", "fileInfo": {"name": "test.txt"}}
    )
    expected_response = [
        "Received file request,",
        "but only text is currently supported",
    ]
    assert response.status_code == 200
    assert response.json() == {"response": " ".join(expected_response)}


def test_chat_endpoint_missing_message():
    response = client.post("/api/chat", json={"type": "text"})
    assert response.status_code == 200
    assert response.json() == {"response": "Invalid input format"}
