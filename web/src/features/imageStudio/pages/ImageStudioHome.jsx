import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Hash,
  SlidersHorizontal,
} from "lucide-react";

const aspectOptions = ["1:1", "4:5", "16:9", "9:16"];
const sampleOptions = ["01", "02", "04", "08"];
const styles = [
  "Realistic",
  "Cinematic",
  "Digital Art",
  "Illustration",
  "3D Render",
  "Anime",
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

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedAspect, setSelectedAspect] = useState("1:1");
  const [selectedSamples, setSelectedSamples] = useState("01");
  const [selectedStyle, setSelectedStyle] = useState("Cinematic");

  function appendChip(value) {
    setPrompt((prev) => (prev ? `${prev}, ${value}` : value));
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col xl:flex-row">
      <section className="w-full shrink-0 border-r border-mahi-outlineVariant/30 p-8 xl:w-[380px] xl:overflow-y-auto">
        <div className="space-y-9">
          {/* INPUT PANEL */}
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
                  Build the primary visual directive for neural synthesis. Use
                  descriptive cinematic language, materials, lighting, mood, and
                  composition.
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
                  {prompt.length}/500
                </span>
              </div>

              <textarea
                className="h-40 w-full resize-none bg-transparent px-4 py-4 text-[13px] leading-7 text-white placeholder:text-white/18 outline-none"
                placeholder="Describe the image you want to generate...&#10;Example: Hyper-realistic luxury perfume bottle on reflective black glass, cyan rim lighting, floating particles, cinematic shadows, ultra detailed..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
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
                  defaultValue="842913"
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
                  type="text"
                  defaultValue="50"
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* ASPECT */}
          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Aspect Grid
            </label>

            <div className="grid grid-cols-2 gap-px border border-mahi-accent/30 bg-mahi-accent/20">
              {aspectOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedAspect(option)}
                  className={`bg-black p-5 text-center text-[10px] uppercase tracking-[0.16em] transition-all ${
                    selectedAspect === option
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

          {/* SAMPLE COUNT */}
          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Sample Count
            </label>
            <div className="grid grid-cols-4 border border-mahi-accent/30">
              {sampleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedSamples(option)}
                  className={`py-3 text-[10px] font-mono transition-all ${
                    selectedSamples === option
                      ? "bg-mahi-accent text-black"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* FIDELITY */}
          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Fidelity Level
            </label>
            <select className="w-full border border-mahi-accent bg-transparent p-3 text-[10px] uppercase tracking-[0.16em] text-white outline-none">
              <option className="bg-black">STANDARD_01</option>
              <option className="bg-black">HIGH_DEF_02</option>
              <option className="bg-black">ULTRA_RES_03</option>
            </select>
          </div>

          {/* STYLE */}
          <div>
            <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Artistic Profile
            </label>
            <div className="grid grid-cols-2 gap-px border border-mahi-accent/30 bg-mahi-accent/20">
              {styles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`bg-black px-3 py-4 text-[10px] uppercase tracking-[0.16em] transition-all ${
                    selectedStyle === style
                      ? "border border-mahi-accent text-mahi-accent"
                      : "text-white/35 hover:text-mahi-accent"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* ENTROPY */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Entropy Control
              </label>
              <span className="text-[10px] font-mono text-mahi-accent">0.75</span>
            </div>

            <div className="relative h-px bg-white/20">
              <div className="absolute left-0 top-0 h-px w-3/4 bg-mahi-accent" />
              <div className="absolute left-3/4 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border border-mahi-accent bg-black" />
            </div>

            <div className="mt-3 flex justify-between text-[8px] uppercase tracking-[0.2em] text-white/30">
              <span>Minimal</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* EXCLUSION */}
          <div className="border-t border-mahi-outlineVariant/25 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Exclusion Filter
              </label>
              <div className="relative h-4 w-10 border border-mahi-accent/50">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-mahi-accent" />
              </div>
            </div>

            <input
              className="w-full border border-mahi-accent bg-transparent p-3 text-[10px] text-white placeholder:text-white/20 outline-none"
              placeholder="Specify objects for omission..."
            />
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate("/app/image-studio/generating")}
            className="w-full border border-mahi-accent bg-black py-5 text-[12px] font-bold uppercase tracking-[0.28em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black"
          >
            Initialize Synthesis
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