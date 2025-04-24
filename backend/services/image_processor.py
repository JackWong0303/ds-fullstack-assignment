from PIL import Image
from io import BytesIO
import base64
from typing import Optional, Dict, Any, Tuple


class ImageProcessor:
    """Service for processing and extracting metadata from images."""

    def extract_image_metadata(
        self, image_data: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract metadata from an image.

        Args:
            image_data (Optional[str]): Base64 encoded image data (if provided)

        Returns:
            Dict[str, Any]: Image metadata (dimensions, format, etc.)
        """
        # If image data is not provided, return empty metadata
        if not image_data:
            return {}

        try:
            image_bytes = base64.b64decode(
                image_data.split(",")[-1] if "," in image_data else image_data
            )

            with Image.open(BytesIO(image_bytes)) as img:
                width, height = img.size
                format_name = img.format or "Unknown"
                mode = img.mode

                return {
                    "width": width,
                    "height": height,
                    "format": format_name,
                    "mode": mode,
                    "has_exif": hasattr(img, "_getexif") and img._getexif() is not None,
                }
        except Exception as e:
            return {"error": str(e), "width": 0, "height": 0, "format": "Unknown"}

    def get_image_dimensions(
        self, width: Optional[int] = None, height: Optional[int] = None
    ) -> Tuple[int, int]:
        """
        Get image dimensions, using provided values or defaults.

        Args:
            width (Optional[int]): Image width (if provided)
            height (Optional[int]): Image height (if provided)

        Returns:
            Tuple[int, int]: (width, height) tuple
        """
        default_width = 800
        default_height = 600

        return (width or default_width, height or default_height)
