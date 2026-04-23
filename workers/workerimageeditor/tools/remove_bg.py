from io import BytesIO
from PIL import Image
from rembg import remove, new_session

from workerimageeditor.config import Settings

_session = None


def get_session():
    global _session
    if _session is None:
        _session = new_session(Settings.RMBG_MODEL)
    return _session


def remove_background(input_image: Image.Image) -> Image.Image:
    source = input_image.convert("RGBA")

    buffer = BytesIO()
    source.save(buffer, format="PNG")

    output = remove(buffer.getvalue(), session=get_session())

    return Image.open(BytesIO(output)).convert("RGBA")