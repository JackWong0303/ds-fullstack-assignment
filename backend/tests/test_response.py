from services.response import ResponseService


class TestResponseService:
    def setup_method(self):
        self.service = ResponseService()

    def test_generate_response_hi(self):
        payload = {"message": "hi"}
        result = self.service.generate_response(payload)
        assert result == {"response": "hello there"}

    def test_generate_response_case_insensitive(self):
        payload = {"message": "HI"}
        result = self.service.generate_response(payload)
        assert result == {"response": "hello there"}

    def test_generate_response_default(self):
        payload = {"message": "how are you"}
        result = self.service.generate_response(payload)
        assert result == {"response": "I'm a rule-based bot"}

    def test_generate_response_empty(self):
        payload = {"message": ""}
        result = self.service.generate_response(payload)
        assert result == {"response": "I'm a rule-based bot"}

    def test_generate_response_invalid_input(self):
        payload = {"text": "hi"}
        result = self.service.generate_response(payload)
        assert result == {"response": "Invalid input format"}

    def test_generate_response_invalid_input_not_dict(self):
        result = self.service.generate_response("hi")
        assert result == {"response": "Invalid input format"}
