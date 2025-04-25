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

    def test_generate_response_file_upload(self):
        """Test handling of file upload payload."""
        payload = {
            "type": "file",
            "fileInfo": {
                "name": "test_document.pdf",
                "size": 1024,
                "type": "application/pdf",
            },
        }
        result = self.service.generate_response(payload)
        expected_response = "Thanks for uploading test_document.pdf (1.0 KB)"
        assert result == {"response": expected_response}

    def test_generate_response_file_upload_missing_info(self):
        """Test handling of file upload with missing information."""
        # Missing file name
        payload = {"type": "file", "fileInfo": {"size": 2048}}
        result = self.service.generate_response(payload)
        expected_resp_unknown = "Thanks for uploading unknown file (2.0 KB)"
        assert result == {"response": expected_resp_unknown}

        # Missing file size
        payload = {"type": "file", "fileInfo": {"name": "image.jpg"}}
        result = self.service.generate_response(payload)
        expected_resp_no_size = "Thanks for uploading image.jpg (0 bytes)"
        assert result == {"response": expected_resp_no_size}
