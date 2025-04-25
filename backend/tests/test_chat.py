from fastapi.testclient import TestClient
from io import BytesIO
from PIL import Image
from main import app

client = TestClient(app)


def create_test_image(width=100, height=80):
    """Create a simple test image."""
    image = Image.new("RGB", (width, height), color="red")
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer.getvalue()


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
    payload = {
        "type": "file",
        "fileInfo": {"name": "test.txt", "size": 256, "type": "text/plain"},
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200

    # Assuming the actual format is "Thanks for uploading {name} ({size} bytes)"
    expected_response = "Thanks for uploading test.txt (256 bytes)"
    assert response.json() == {"response": expected_response}


def test_chat_endpoint_image():
    """Test image upload handling in the chat endpoint."""
    response = client.post(
        "/api/chat",
        json={
            "type": "image",
            "fileInfo": {
                "name": "test.jpg",
                "size": 1024,
                "type": "image/jpeg",
                "width": 300,
                "height": 200,
            },
        },
    )
    assert response.status_code == 200

    response_data = response.json()
    assert "response" in response_data
    assert "test.jpg" in response_data["response"]
    assert "300x200" in response_data["response"]
    assert "landscape" in response_data["response"].lower()


def test_chat_endpoint_image_no_dimensions():
    """Test image upload with missing dimensions."""
    response = client.post(
        "/api/chat",
        json={
            "type": "image",
            "fileInfo": {
                "name": "no_dims.jpg",
                "size": 768,
                "type": "image/jpeg",
                # No dimensions provided
            },
        },
    )
    assert response.status_code == 200

    response_data = response.json()
    assert "response" in response_data
    assert "no_dims.jpg" in response_data["response"]
    assert "768 bytes" in response_data["response"]
    assert "800x600" in response_data["response"]


def test_chat_endpoint_image_not_supported():
    """Test that image type is not yet supported."""
    payload = {"type": "unsupported", "fileInfo": {"name": "image.jpg"}}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422


def test_chat_endpoint_missing_message():
    response = client.post("/api/chat", json={"type": "text"})
    assert response.status_code == 422


def test_chat_endpoint_square_image():
    """Test square image detection."""
    response = client.post(
        "/api/chat",
        json={
            "type": "image",
            "fileInfo": {
                "name": "square.png",
                "size": 2048,
                "type": "image/png",
                "width": 400,
                "height": 400,
            },
        },
    )
    assert response.status_code == 200

    response_data = response.json()
    assert "square.png" in response_data["response"]
    assert "400x400" in response_data["response"]
    assert "square" in response_data["response"].lower()
