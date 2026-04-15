import os
from dotenv import load_dotenv
load_dotenv(".env", override=True)

import torch
from diffusers import StableDiffusionXLPipeline

token = os.getenv("HF_TOKEN") or None

device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.float16 if device == "cuda" else torch.float32

print("Device:", device)
print("Dtype:", dtype)
print("HF token loaded:", bool(token))

pipe = StableDiffusionXLPipeline.from_pretrained(
    "SG161222/RealVisXL_V5.0",
    torch_dtype=dtype,
    use_safetensors=True,
    variant="fp16" if device == "cuda" and dtype == torch.float16 else None,
    token=token,
)

print("RealVisXL loaded successfully")