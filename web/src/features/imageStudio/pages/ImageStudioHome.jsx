import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Hash,
  SlidersHorizontal,
} from "lucide-react";
import { useImageStudio } from "../context/ImageStudioContext";
import {
  createImageStudioJob,
  fetchImageStudioPresets,
} from "../../../api/imageStudio.api";

const aspectOptions = ["1:1", "4:5", "16:9", "9:16"];
const sampleOptions = [1, 2, 4, 8];
const styles = [
  { label: "Realistic", value: "realistic" },
  { label: "Cinematic", value: "cinematic" },
  { label: "Digital Art", value: "digital-art" },
  { label: "Illustration", value: "digital-art" },
  { label: "3D Render", value: "realistic" },
  { label: "Anime", value: "anime" },
];

const promptChips = [
  "Cyberpunk",
  "Editorial",
  "Moody Light",
  "Ultra Detailed",
  "Neon Glow",
  "Luxury Product",
];

export default function ImageStudioHome() {
  const navigate = useNavigate();
  const {
    form,
    setForm,
    setCurrentJobId,
    setCurrentJob,
    setSelectedPreset,
  } = useImageStudio();

  const [presets, setPresets] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchImageStudioPresets()
      .then(setPresets)
      .catch(console.error);
  }, []);

  function appendChip(value) {
    setForm((prev) => ({
      ...prev,
      prompt: prev.prompt ? `${prev.prompt}, ${value}` : value,
    }));
  }

  function applyPreset(preset) {
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
      prompt: preset.prompt_prefix
        ? `${preset.prompt_prefix}${prev.prompt ? `, ${prev.prompt}` : ""}`
        : prev.prompt,
    }));
  }

  async function handleSubmit() {
    if (!form.prompt.trim()) return;

    try {
      setSubmitting(true);

      const job = await createImageStudioJob({
        title: form.title,
        prompt: form.prompt,
        negativePrompt: form.negativePrompt,
        exclusionPrompt: form.exclusionPrompt,
        aspectRatio: form.aspectRatio,
        sampleCount: form.sampleCount,
        styleKey: form.styleKey,
        fidelityLevel: form.fidelityLevel,
        entropy: form.entropy,
        seed: form.seed ? Number(form.seed) : null,
        steps: Number(form.steps),
        guidanceScale: Number(form.guidanceScale),
        presetId: form.presetId,
      });

      setCurrentJobId(job.id);
      setCurrentJob(job);
      navigate("/app/image-studio/generating");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col xl:flex-row">
      <section className="w-full shrink-0 border-r border-mahi-outlineVariant/30 p-8 xl:w-[380px] xl:overflow-y-auto">
        <div className="space-y-9">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center border border-mahi-accent/35 bg-mahi-accent/5 text-mahi-accent">
                <Sparkles size={16} strokeWidth={2} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.28em] text-mahi-accent">
                  Input Sequence
                </label>
                <p className="mt-2 max-w-[290px] text-[11px] leading-6 text-white/35">
                  Build the primary visual directive for neural synthesis. Use descriptive cinematic language,
                  materials, lighting, mood, and composition.
                </p>
              </div>
            </div>

            <div className="border border-mahi-accent/30 bg-black/60">
              <div className="flex items-center justify-between border-b border-mahi-accent/15 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Wand2 size={14} className="text-mahi-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent">
                    Prompt Vector
                  </span>
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  {form.prompt.length}/500
                </span>
              </div>

              <textarea
                className="h-40 w-full resize-none bg-transparent px-4 py-4 text-[13px] leading-7 text-white placeholder:text-white/18 outline-none"
                placeholder="Describe the image you want to generate..."
                value={form.prompt}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    prompt: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => appendChip(chip)}
                  className="border border-mahi-accent/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition-all hover:border-mahi-accent/50 hover:text-mahi-accent"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="border border-mahi-outlineVariant/20 bg-black/30">
              <div className="flex items-center gap-2 border-b border-mahi-outlineVariant/15 px-4 py-3">
                <SlidersHorizontal size={14} className="text-mahi-accent/80" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent/90">
                  Negative Prompt
                </span>
              </div>

              <input
                type="text"
                value={form.negativePrompt}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    negativePrompt: e.target.value,
                  }))
                }
                className="w-full bg-transparent px-4 py-4 text-[12px] text-white placeholder:text-white/18 outline-none"
                placeholder="Blur, low quality, distortion, extra objects, bad anatomy..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-mahi-outlineVariant/20 bg-black/30 px-4 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <Hash size={13} className="text-mahi-accent/80" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent/90">
                    Seed
                  </span>
                </div>
                <input
                  type="text"
                  value={form.seed}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seed: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>

              <div className="border border-mahi-outlineVariant/20 bg-black/30 px-4 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <Hash size={13} className="text-mahi-accent/80" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-mahi-accent/90">
                    Steps
                  </span>
                </div>
                <input
                  type="number"
                  value={form.steps}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      steps: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Aspect Grid
            </label>

            <div className="grid grid-cols-2 gap-px border border-mahi-accent/30 bg-mahi-accent/20">
              {aspectOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      aspectRatio: option,
                    }))
                  }
                  className={`bg-black p-5 text-center text-[10px] uppercase tracking-[0.16em] transition-all ${
                    form.aspectRatio === option
                      ? "border border-mahi-accent text-mahi-accent shadow-[0_0_14px_rgba(83,245,231,0.12)]"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  <div className="mb-2 flex justify-center">
                    <div
                      className={`border border-current ${
                        option === "1:1"
                          ? "h-5 w-5"
                          : option === "4:5"
                          ? "h-6 w-5"
                          : option === "16:9"
                          ? "h-3.5 w-6"
                          : "h-6 w-3.5"
                      }`}
                    />
                  </div>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Sample Count
            </label>
            <div className="grid grid-cols-4 border border-mahi-accent/30">
              {sampleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      sampleCount: option,
                    }))
                  }
                  className={`py-3 text-[10px] font-mono transition-all ${
                    form.sampleCount === option
                      ? "bg-mahi-accent text-black"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  {String(option).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Fidelity Level
            </label>
            <select
              value={form.fidelityLevel}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  fidelityLevel: e.target.value,
                }))
              }
              className="w-full border border-mahi-accent bg-transparent p-3 text-[10px] uppercase tracking-[0.16em] text-white outline-none"
            >
              <option className="bg-black" value="STANDARD_01">
                STANDARD_01
              </option>
              <option className="bg-black" value="HIGH_DEF_02">
                HIGH_DEF_02
              </option>
              <option className="bg-black" value="ULTRA_RES_03">
                ULTRA_RES_03
              </option>
            </select>
          </div>

          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Artistic Profile
            </label>
            <div className="grid grid-cols-2 gap-px border border-mahi-accent/30 bg-mahi-accent/20">
              {styles.map((style) => (
                <button
                  key={style.label}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      styleKey: style.value,
                    }))
                  }
                  className={`bg-black px-3 py-4 text-[10px] uppercase tracking-[0.16em] transition-all ${
                    form.styleKey === style.value
                      ? "border border-mahi-accent text-mahi-accent"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Entropy Control
              </label>
              <span className="text-[10px] font-mono text-mahi-accent">
                {Number(form.entropy).toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={form.entropy}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  entropy: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div className="border-t border-mahi-outlineVariant/25 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Exclusion Filter
              </label>
            </div>

            <input
              className="w-full border border-mahi-accent bg-transparent p-3 text-[10px] text-white placeholder:text-white/20 outline-none"
              placeholder="Specify objects for omission..."
              value={form.exclusionPrompt}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  exclusionPrompt: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Presets
            </label>

            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="border border-mahi-outlineVariant/25 bg-black/40 px-4 py-3 text-left text-[11px] font-semibold text-white/80 transition-all hover:border-mahi-accent/40 hover:bg-mahi-accent/[0.03]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={submitting || !form.prompt.trim()}
            onClick={handleSubmit}
            className="w-full border border-mahi-accent bg-black py-5 text-[12px] font-bold uppercase tracking-[0.28em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Launching..." : "Initialize Synthesis"}
          </button>
        </div>
      </section>

      <section className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#53f5e7 1px, transparent 1px), linear-gradient(90deg, #53f5e7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-lg px-8 text-center">
          <div className="mx-auto mb-12 flex h-32 w-32 rotate-45 items-center justify-center border border-mahi-accent shadow-[0_0_30px_rgba(83,245,231,0.10)]">
            <ImageIcon size={46} className="-rotate-45 text-mahi-accent" />
          </div>

          <h1 className="theme-heading text-4xl font-bold uppercase tracking-[-0.05em] text-white">
            Canvas_Standby
          </h1>
          <p className="mt-6 text-[12px] uppercase leading-7 tracking-[0.18em] text-white/35">
            Awaiting neural initialization. Input seed data via the control terminal to begin generation.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 text-[8px] uppercase tracking-[0.35em] text-mahi-accent/40">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 bg-mahi-accent" />
              Studio_v2.4
            </span>
            <span className="text-mahi-accent/20">||</span>
            <span>Synthetic_Engine_Active</span>
          </div>
        </div>
      </section>
    </div>
  );
}