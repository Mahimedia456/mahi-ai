const ASPECT_TO_SIZE = {
  "1:1": { width: 512, height: 512 },
  "4:5": { width: 640, height: 800 },
  "16:9": { width: 768, height: 432 },
  "9:16": { width: 432, height: 768 },
};

export function resolveAspectSize(aspectRatio = "1:1") {
  return ASPECT_TO_SIZE[aspectRatio] || ASPECT_TO_SIZE["1:1"];
}

export function normalizeSampleCount(value) {
  const parsed = Number(value);

  if (![1, 2, 4, 8].includes(parsed)) {
    return 1;
  }

  return parsed;
}

export function validateCreateStudioJob(payload = {}) {
  const prompt = String(payload.prompt || "").trim();

  if (!prompt) {
    const err = new Error("Prompt is required.");
    err.statusCode = 400;
    throw err;
  }

  const aspectRatio = String(payload.aspectRatio || "1:1");
  const steps = Math.max(1, Math.min(80, Number(payload.steps || 20)));
  const sampleCount = normalizeSampleCount(payload.sampleCount);
  const guidanceScale = Math.max(1, Math.min(20, Number(payload.guidanceScale || 7.5)));
  const entropy = Math.max(0, Math.min(1, Number(payload.entropy ?? 0.75)));
  const fidelityLevel = String(payload.fidelityLevel || "STANDARD_01");
  const styleKey = String(payload.styleKey || "cinematic");
  const negativePrompt = String(payload.negativePrompt || "").trim();
  const exclusionPrompt = String(payload.exclusionPrompt || "").trim();
  const presetId = payload.presetId || null;
  const seed =
    payload.seed !== undefined &&
    payload.seed !== null &&
    String(payload.seed).trim() !== ""
      ? Number(payload.seed)
      : null;

  const size = resolveAspectSize(aspectRatio);

  return {
    title: payload.title ? String(payload.title).trim() : null,
    prompt,
    negativePrompt,
    exclusionPrompt,
    aspectRatio,
    steps,
    sampleCount,
    guidanceScale,
    entropy,
    fidelityLevel,
    styleKey,
    presetId,
    seed,
    width: size.width,
    height: size.height,
  };
}