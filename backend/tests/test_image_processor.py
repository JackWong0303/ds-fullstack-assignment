import base64
from io import BytesIO
from PIL import Image
from services.image_processor import ImageProcessor


def create_test_image(width=100, height=80):
    """Create a simple test image."""
    image = Image.new("RGB", (width, height), color="red")
    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer.getvalue()


def test_image_processor_extract_metadata():
    """Test that the ImageProcessor correctly extracts image metadata."""
    processor = ImageProcessor()

    img_data = create_test_image(width=200, height=150)
    img_base64 = base64.b64encode(img_data).decode("utf-8")

    metadata = processor.extract_image_metadata(img_base64)

    assert metadata["width"] == 200
    assert metadata["height"] == 150
    assert metadata["format"] == "JPEG"
    assert "mode" in metadata


def test_image_processor_get_dimensions():
    """Test that the get_image_dimensions method works correctly."""
    processor = ImageProcessor()

    # Test with provided dimensions
    width, height = processor.get_image_dimensions(300, 200)
    assert width == 300
    assert height == 200

    # Test with default dimensions
    width, height = processor.get_image_dimensions()
    assert width == 800
    assert height == 600

    # Test with missing height
    width, height = processor.get_image_dimensions(400, None)
    assert width == 400
    assert height == 600
