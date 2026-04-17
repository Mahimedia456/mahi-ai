from PIL import Image, ImageFilter, ImageEnhance


def upscale_image(
    input_image: Image.Image,
    scale_factor: int = 2,
    denoise: bool = False,
    face_enhance: bool = False,
) -> Image.Image:
    image = input_image.convert("RGBA")
    width, height = image.size

    scaled = image.resize(
        (width * max(1, int(scale_factor)), height * max(1, int(scale_factor))),
        Image.LANCZOS,
    )

    if denoise:
        scaled = scaled.filter(ImageFilter.MedianFilter(size=3))
        scaled = scaled.filter(ImageFilter.SMOOTH_MORE)

    scaled = scaled.filter(ImageFilter.UnsharpMask(radius=1.8, percent=180, threshold=2))

    if face_enhance:
        sharp = ImageEnhance.Sharpness(scaled)
        scaled = sharp.enhance(1.35)

        contrast = ImageEnhance.Contrast(scaled)
        scaled = contrast.enhance(1.08)

    return scaled