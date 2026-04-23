import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchImageStudioPresets } from "../../../api/imageStudio.api";
import { useImageStudio } from "../context/ImageStudioContext";

export default function ImageStudioPresets() {
  const navigate = useNavigate();
  const { setForm, setSelectedPreset } = useImageStudio();
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    fetchImageStudioPresets()
      .then(setPresets)
      .catch(console.error);
  }, []);

  function handleApply(preset) {
    setSelectedPreset(preset);

    setForm((prev) => ({
      ...prev,
      presetId: preset.id,
      styleKey: preset.style_key,
      aspectRatio: preset.default_aspect_ratio,
      steps: preset.default_steps,
      guidanceScale: Number(preset.default_guidance),
      entropy: Number(preset.default_strength),
      sampleCount: preset.default_sample_count,
      negativePrompt: preset.negative_prompt || prev.negativePrompt,
      prompt: preset.prompt_prefix || prev.prompt,
    }));

    navigate("/app/image-studio");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Presets
        </h1>
        <p className="mt-3 text-white/35">
          Apply reusable generation profiles across your image workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleApply(preset)}
            className="border border-mahi-outlineVariant/25 bg-black/40 p-8 text-left transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/[0.03]"
          >
            <p className="theme-heading text-1xl font-bold text-white">{preset.name}</p>
            <p className="mt-3 text-sm text-white/35">
              Saved neural style profile ready for execution.
            </p>
          </button>
        ))}
      </div>

      {!presets.length ? (
        <div className="mt-16 text-center text-sm text-white/40">
          No presets found.
        </div>
      ) : null}
    </div>
  );
}