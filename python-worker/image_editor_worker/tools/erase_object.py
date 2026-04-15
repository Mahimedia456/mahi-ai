from .generative_fill import generative_fill


def erase_object(
    input_image,
    mask_image,
    strength: float = 0.78,
):
    return generative_fill(
        input_image=input_image,
        mask_image=mask_image,
        prompt="clean realistic continuation of the surrounding scene, seamless restoration, natural texture continuity",
        negative_prompt="artifact, duplicate object, blur, distortion, changed face, changed body, changed clothing outside the masked area",
        strength=max(0.72, float(strength)),
    )