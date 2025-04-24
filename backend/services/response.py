from .image_processor import ImageProcessor


class ResponseService:

    def __init__(self):
        self.image_processor = ImageProcessor()

    def generate_response(self, payload: dict) -> dict:
        """
        Generate a response based on the input payload.

        Args:
            payload (dict): Input data containing either:
                            - {"message": "user input string"} for text inputs
                            - {"type": "file", "fileInfo": {...}} for file inputs
                            - {"type": "image", "fileInfo": {...}} for image inputs

        Returns:
            dict: Response with format {"response": "bot response string"}
        """
        # Handle image type requests
        if (
            isinstance(payload, dict)
            and payload.get("type") == "image"
            and "fileInfo" in payload
        ):
            fileInfo = payload.get("fileInfo", {})
            filename = fileInfo.get("name", "unknown image")
            filesize = fileInfo.get("size", 0)
            width = fileInfo.get("width", 0)
            height = fileInfo.get("height", 0)
            image_type = fileInfo.get("type", "")

            image_format = "Unknown"
            if image_type:
                image_format = image_type.split("/")[-1].upper()
            elif "." in filename:
                extension = filename.split(".")[-1].upper()
                if extension in ["JPG", "JPEG", "PNG", "GIF", "BMP", "WEBP"]:
                    image_format = extension

            if not width or not height:
                width, height = self.image_processor.get_image_dimensions()

            formatted_size = self._format_file_size(filesize)

            response_parts = [
                f"Thanks for uploading {filename}",
                f"({formatted_size}, {width}x{height} {image_format})",
            ]

            if width > height:
                response_parts.append("This appears to be a landscape image.")
            elif height > width:
                response_parts.append("This appears to be a portrait image.")
            else:
                response_parts.append("This appears to be a square image.")

            return {"response": " ".join(response_parts)}

        # Handle file type requests
        if (
            isinstance(payload, dict)
            and payload.get("type") == "file"
            and "fileInfo" in payload
        ):
            fileInfo = payload.get("fileInfo", {})
            filename = fileInfo.get("name", "unknown file")
            filesize = fileInfo.get("size", 0)
            formatted_size = self._format_file_size(filesize)

            return {"response": f"Thanks for uploading {filename} ({formatted_size})"}

        # Handle text type requests
        if (
            not isinstance(payload, dict)
            or "message" not in payload
            or payload.get("message") is None
        ):
            return {"response": "Invalid input format"}

        user_message = payload.get("message", "").strip().lower()

        # Apply rule-based logic
        if user_message == "hi":
            return {"response": "hello there"}

        # Default response
        return {"response": "I'm a rule-based bot"}

    def _format_file_size(self, size_in_bytes: int) -> str:
        """Format file size in a human-readable format."""
        if size_in_bytes < 1024:
            return f"{size_in_bytes} bytes"
        elif size_in_bytes < 1024 * 1024:
            return f"{size_in_bytes / 1024:.1f} KB"
        else:
            return f"{size_in_bytes / (1024 * 1024):.1f} MB"
