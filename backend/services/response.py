class ResponseService:

    def generate_response(self, payload: dict) -> dict:
        """
        Generate a response based on the input payload.

        Args:
            payload (dict): Input data containing either:
                            - {"message": "user input string"} for text inputs
                            - {"type": "file", "fileInfo": {...}} for file inputs

        Returns:
            dict: Response with format {"response": "bot response string"}
        """
        # Handle file type requests
        if (
            isinstance(payload, dict)
            and payload.get("type") == "file"
            and "fileInfo" in payload
        ):
            fileInfo = payload.get("fileInfo", {})
            filename = fileInfo.get("name", "unknown file")
            filesize = fileInfo.get("size", 0)
            return {
                "response": f"Thanks for uploading {filename} (size {filesize} bytes)"
            }

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
