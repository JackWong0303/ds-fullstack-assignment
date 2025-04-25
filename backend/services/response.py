from .image_processor import ImageProcessor


class ResponseService:
    """Service to generate responses for different types of user inputs."""

    def __init__(self):
        self.image_processor = ImageProcessor()

    def generate_response(self, payload: dict) -> dict:
        """
        Generate a response based on the input payload type.

        Args:
            payload (dict): Input data containing either:
                - {"message": "user input string"} for text
                - {"type": "file", "fileInfo": {...}} for files
                - {"type": "image", "fileInfo": {...}} for images

        Returns:
            dict: Response with format {"response": "bot response string"}
        """

        if payload.get("type") == "image" and "fileInfo" in payload:
            return self._handle_image(payload["fileInfo"])
        elif payload.get("type") == "file" and "fileInfo" in payload:
            return self._handle_file(payload["fileInfo"])
        elif "message" in payload:
            return self._handle_text(payload["message"])
        else:
            return {"response": "Invalid input format"}

    def _handle_text(self, message: str) -> dict:
        """Handle text-based messages."""

        user_message = message.strip().lower()

        # Apply rule-based logic
        if user_message == "hi":
            return {"response": "hello there"}

        # Default response
        return {"response": "I'm a rule-based bot"}

    def _handle_file(self, file_info: dict) -> dict:
        """Handle file uploads."""
        filename = file_info.get("name", "unknown file")
        filesize = file_info.get("size", 0)
        formatted_size = self._format_file_size(filesize)

        response = f"Thanks for uploading {filename} ({formatted_size})"
        return {"response": response}

    def _handle_image(self, file_info: dict) -> dict:
        """Handle image uploads."""
        filename = file_info.get("name", "unknown image")
        filesize = file_info.get("size", 0)
        width = file_info.get("width", 0)
        height = file_info.get("height", 0)
        image_type = file_info.get("type", "")

        image_format = self._determine_image_format(filename, image_type)

        if not width or not height:
            width, height = self.image_processor.get_image_dimensions()

        formatted_size = self._format_file_size(filesize)

        response_parts = [
            f"Thanks for uploading {filename}",
            f"({formatted_size}, {width}x{height} {image_format})",
            self._get_orientation_description(width, height),
        ]

        return {"response": " ".join(response_parts)}

    def _determine_image_format(self, filename: str, image_type: str) -> str:
        """Determine the image format from file info."""
        if image_type:
            return image_type.split("/")[-1].upper()

        if "." in filename:
            extension = filename.split(".")[-1].upper()
            if extension in ["JPG", "JPEG", "PNG", "GIF", "BMP", "WEBP"]:
                return extension

        return "Unknown"

    def _get_orientation_description(self, width: int, height: int) -> str:
        """Get a description of the image orientation."""
        if width > height:
            return "This appears to be a landscape image."
        elif height > width:
            return "This appears to be a portrait image."
        else:
            return "This appears to be a square image."

    def _format_file_size(self, size_in_bytes: int) -> str:
        """Format file size in a human-readable format."""
        if size_in_bytes < 1024:
            return f"{size_in_bytes} bytes"
        elif size_in_bytes < 1024 * 1024:
            return f"{size_in_bytes / 1024:.1f} KB"
        else:
            return f"{size_in_bytes / (1024 * 1024):.1f} MB"
