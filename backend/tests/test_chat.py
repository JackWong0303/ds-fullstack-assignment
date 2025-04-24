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


def test_chat_endpoint_file():
    """Test file upload handling in the chat endpoint."""
    response = client.post(
        "/api/chat",
        json={
            "type": "file",
            "fileInfo": {"name": "test.txt", "size": 256, "type": "text/plain"},
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "response": "Thanks for uploading test.txt (size 256 bytes)"
    }


def test_chat_endpoint_image_not_supported():
    """Test that image type is not yet supported."""
    response = client.post(
        "/api/chat", json={"type": "image", "fileInfo": {"name": "image.jpg"}}
    )
    expected_response = [
        "Received image request,",
        "but only text and file are currently supported",
    ]
    assert response.status_code == 200
    assert response.json() == {"response": " ".join(expected_response)}


def test_chat_endpoint_missing_message():
    response = client.post("/api/chat", json={"type": "text"})
    assert response.status_code == 200
    assert response.json() == {"response": "Invalid input format"}
