class ResponseService:

    def generate_response(self, payload: dict) -> dict:
        """
        Generate a response based on the input payload.

        Args:
            payload (dict): Input data containing user message
                            Expected format: {"message": "user input string"}

        Returns:
            dict: Response with format {"response": "bot response string"}
        """
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
