from collections import deque
from typing import Optional
import random

from PIL import Image, ImageFilter

from workerimageeditor.tools.generative_fill import generative_fill


MIN_COMPONENT_PIXELS = 120
PAD_RATIO = 0.35
MAX_COMPONENTS = 8
RESAMPLE = Image.Resampling.LANCZOS


def _pixel_to_int(value: object) -> int:
    if isinstance(value, int):
        return value

    if isinstance(value, float):
        return int(value)

    if isinstance(value, tuple):
        if not value:
            return 0
        first = value[0]
        if isinstance(first, (int, float)):
            return int(first)
        return 0

    return 0


def _to_binary_mask(mask_image: Image.Image, threshold: int = 32) -> Image.Image:
    gray = mask_image.convert("L")
    gray = gray.filter(ImageFilter.MaxFilter(size=9))
    return gray.point(lambda p: 255 if p >= threshold else 0, mode="L")


def _find_components(mask_image: Image.Image) -> list[tuple[int, int, int, int, int]]:
    mask = _to_binary_mask(mask_image)
    w, h = mask.size
    px = mask.load()

    if px is None:
        return []

    visited = [[False for _ in range(w)] for _ in range(h)]
    components: list[tuple[int, int, int, int, int]] = []

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for y in range(h):
        for x in range(w):
            if visited[y][x] or _pixel_to_int(px[x, y]) == 0:
                continue

            q = deque()
            q.append((x, y))
            visited[y][x] = True

            min_x = max_x = x
            min_y = max_y = y
            count = 0

            while q:
                cx, cy = q.popleft()
                count += 1

                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                for dx, dy in directions:
                    nx, ny = cx + dx, cy + dy
                    if nx < 0 or ny < 0 or nx >= w or ny >= h:
                        continue
                    if visited[ny][nx]:
                        continue
                    if _pixel_to_int(px[nx, ny]) == 0:
                        continue

                    visited[ny][nx] = True
                    q.append((nx, ny))

            if count >= MIN_COMPONENT_PIXELS:
                components.append((min_x, min_y, max_x, max_y, count))

    components.sort(key=lambda item: item[4], reverse=True)
    return components[:MAX_COMPONENTS]


def _expand_box(
    box: tuple[int, int, int, int],
    image_size: tuple[int, int],
) -> tuple[int, int, int, int]:
    min_x, min_y, max_x, max_y = box
    w, h = image_size

    bw = max_x - min_x + 1
    bh = max_y - min_y + 1

    pad_x = max(24, int(bw * PAD_RATIO))
    pad_y = max(24, int(bh * PAD_RATIO))

    x1 = max(0, min_x - pad_x)
    y1 = max(0, min_y - pad_y)
    x2 = min(w, max_x + pad_x + 1)
    y2 = min(h, max_y + pad_y + 1)

    return (x1, y1, x2, y2)


def _crop_region(
    image: Image.Image,
    mask: Image.Image,
    crop_box: tuple[int, int, int, int],
) -> tuple[Image.Image, Image.Image]:
    crop_image = image.crop(crop_box).convert("RGBA")
    crop_mask = mask.crop(crop_box).convert("L")

    crop_mask = crop_mask.filter(ImageFilter.MaxFilter(size=21))
    crop_mask = crop_mask.filter(ImageFilter.GaussianBlur(radius=3))

    return crop_image, crop_mask


def _resize_for_edit(
    image: Image.Image,
    mask: Image.Image,
) -> tuple[Image.Image, Image.Image, tuple[int, int]]:
    w, h = image.size

    target_long = 1024
    scale = target_long / max(w, h)

    if scale < 1.0:
        scale = 1.0

    new_w = max(512, int(round(w * scale / 8) * 8))
    new_h = max(512, int(round(h * scale / 8) * 8))

    resized_image = image.resize((new_w, new_h), RESAMPLE)
    resized_mask = mask.resize((new_w, new_h), RESAMPLE)

    return resized_image, resized_mask, (w, h)


def _prepare_for_object_insertion(
    image: Image.Image,
    mask: Image.Image,
) -> Image.Image:
    base = image.convert("RGB")
    mask_l = mask.convert("L")

    noisy = base.copy()

    px = noisy.load()
    mpx = mask_l.load()

    if px is None or mpx is None:
        return image.convert("RGBA")

    w, h = noisy.size

    for y in range(h):
        for x in range(w):
            mask_value = _pixel_to_int(mpx[x, y])
            if mask_value > 160:
                px[x, y] = (
                    random.randint(70, 190),
                    random.randint(70, 190),
                    random.randint(70, 190),
                )

    noisy = noisy.filter(ImageFilter.GaussianBlur(radius=1.2))
    return noisy.convert("RGBA")


def build_add_object_prompt(user_prompt: Optional[str] = None) -> str:
    extra = (user_prompt or "").strip()

    base = (
        "Clearly add the requested object inside the masked area. "
        "The masked area must visibly change. "
        "Do not leave the masked area empty. "
        "Make the object clearly visible, realistic, well defined, properly sized, "
        "naturally placed, with matching perspective, matching lighting, matching shadows, "
        "and seamless blending. Preserve everything outside the masked area."
    )

    if extra:
        return f"{extra}. {base}"

    return base


def build_add_object_negative_prompt(user_negative_prompt: Optional[str] = None) -> str:
    base_negative = (
        "empty masked area, unchanged masked area, no object, invisible object, tiny object, "
        "cropped object, duplicate object, distorted object, floating object, blur, artifacts, "
        "wrong perspective, wrong lighting, watermark, text, logo, low quality"
    )

    extra_negative = (user_negative_prompt or "").strip()
    if extra_negative:
        return f"{extra_negative}, {base_negative}"

    return base_negative


def _apply_single_component(
    base_image: Image.Image,
    full_mask: Image.Image,
    component_box: tuple[int, int, int, int],
    prompt: Optional[str],
    negative_prompt: Optional[str],
    strength: float,
) -> Image.Image:
    crop_box = _expand_box(component_box, base_image.size)
    crop_image, crop_mask = _crop_region(base_image, full_mask, crop_box)

    crop_image = _prepare_for_object_insertion(crop_image, crop_mask)

    resized_image, resized_mask, original_crop_size = _resize_for_edit(crop_image, crop_mask)

    edited = generative_fill(
        input_image=resized_image,
        mask_image=resized_mask,
        prompt=build_add_object_prompt(prompt),
        negative_prompt=build_add_object_negative_prompt(negative_prompt),
        strength=max(0.88, min(float(strength), 0.95)),
    )

    edited = edited.resize(original_crop_size, RESAMPLE).convert("RGBA")
    result = base_image.copy()
    result.alpha_composite(edited, dest=(crop_box[0], crop_box[1]))
    return result


def add_object(
    input_image: Image.Image,
    mask_image: Image.Image,
    prompt: Optional[str] = None,
    negative_prompt: Optional[str] = None,
    strength: float = 0.92,
) -> Image.Image:
    base = input_image.convert("RGBA")
    full_mask = _to_binary_mask(mask_image)

    components = _find_components(full_mask)

    if not components:
        prepared = _prepare_for_object_insertion(base, full_mask)
        return generative_fill(
            input_image=prepared,
            mask_image=full_mask,
            prompt=build_add_object_prompt(prompt),
            negative_prompt=build_add_object_negative_prompt(negative_prompt),
            strength=max(0.88, min(float(strength), 0.95)),
        )

    result = base
    for min_x, min_y, max_x, max_y, _count in components:
        result = _apply_single_component(
            base_image=result,
            full_mask=full_mask,
            component_box=(min_x, min_y, max_x, max_y),
            prompt=prompt,
            negative_prompt=negative_prompt,
            strength=strength,
        )

    return result