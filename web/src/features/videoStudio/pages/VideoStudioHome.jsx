import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clapperboard, Zap } from "lucide-react";

const durations = ["05.0s", "10.0s", "15.0s"];
const formats = ["16:9", "9:16", "1:1", "4:5"];
const manifests = [
  "CINEMATIC_ENGINE",
  "REALISTIC_V4",
  "NOIR_SYNTHETIC",
  "ARCHITECT_FLOW",
];

export default function VideoStudioHome() {
  const navigate = useNavigate();

  const [duration, setDuration] = useState("10.0s");
  const [format, setFormat] = useState("16:9");
  const [manifest, setManifest] = useState("CINEMATIC_ENGINE");
  const [prompt, setPrompt] = useState("");

  return (
    <section className="flex h-[calc(100vh-144px)] overflow-hidden">
      <aside className="w-full shrink-0 border-r border-mahi-accent/20 px-8 py-10 md:w-80 md:overflow-y-auto">
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
                Input Prompt
              </label>
              <span className="font-mono text-[8px] text-white/20">ID: 4882-X</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[140px] w-full resize-none border border-mahi-accent/20 bg-transparent p-4 text-xs text-white placeholder:text-white/20 outline-none transition-all focus:border-mahi-accent"
              placeholder="DESCRIBE_TARGET_SEQUENCE..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Timeline Duration
            </label>

            <div className="grid grid-cols-3 gap-3">
              {durations.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDuration(item)}
                  className={`py-2.5 text-[10px] transition-all ${
                    duration === item
                      ? "border border-mahi-accent bg-mahi-accent/5 font-bold text-mahi-accent"
                      : "border border-mahi-accent/20 text-white/40 hover:border-mahi-accent hover:text-mahi-accent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Frame Format
            </label>

            <div className="grid grid-cols-4 gap-2">
              {formats.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFormat(item)}
                  className={`flex flex-col items-center justify-center p-3 transition-all ${
                    format === item
                      ? "border border-mahi-accent bg-mahi-accent/5 text-mahi-accent"
                      : "border border-mahi-accent/10 text-white/30 hover:border-mahi-accent/40 hover:text-white/60"
                  }`}
                >
                  <div
                    className={`mb-1.5 border ${
                      item === "16:9"
                        ? "h-3.5 w-6"
                        : item === "9:16"
                        ? "h-6 w-3.5"
                        : item === "1:1"
                        ? "h-4 w-4"
                        : "h-5 w-4"
                    } border-current`}
                  />
                  <span className="font-mono text-[8px]">{item}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Style Manifest
            </label>

            <select
              value={manifest}
              onChange={(e) => setManifest(e.target.value)}
              className="w-full appearance-none border border-mahi-accent/20 bg-transparent p-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white outline-none"
            >
              {manifests.map((item) => (
                <option key={item} className="bg-black">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            <div className="flex items-end justify-between">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
                Kinetic Flow
              </label>
              <span className="font-mono text-[9px] uppercase tracking-widest text-mahi-accent">
                LEVEL_050
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="h-[1px] w-full cursor-pointer appearance-none bg-mahi-accent/20 accent-mahi-accent"
            />

            <div className="flex justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
              <span>MIN_KINETIC</span>
              <span>MAX_KINETIC</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => navigate("/app/video-studio/generating")}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden border border-mahi-accent bg-mahi-accent/5 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black"
            >
              <Zap size={15} />
              <span>Initialize_Generation</span>
            </button>
          </div>
        </div>
      </aside>

      <section className="relative hidden flex-1 items-center justify-center overflow-hidden md:flex">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #53f5e7 1px, transparent 1px), linear-gradient(to bottom, #53f5e7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex aspect-video w-full max-w-5xl flex-col items-center justify-center border border-mahi-accent/20 p-12 text-center">
          <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-mahi-accent" />
          <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-mahi-accent" />
          <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-mahi-accent" />
          <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-mahi-accent" />

          <div className="mb-10">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center border border-mahi-accent/30">
              <Clapperboard size={36} className="text-mahi-accent/70" />
            </div>

            <h2 className="theme-heading text-3xl font-medium uppercase tracking-[0.15em] text-white">
              System Ready For Input
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[10px] uppercase tracking-[0.18em] text-white/28">
              SYNTHETIC_IMAGINATION_CORES_STANDBY // DEFINE_PARAMETERS_TO_BEGIN
            </p>
          </div>

          <div className="flex items-center gap-4 border border-mahi-accent/20 bg-mahi-accent/5 px-6 py-2.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-mahi-accent shadow-[0_0_8px_#53f5e7]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-mahi-accent/80">
              Kernel_v.4.0_Stable
            </span>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-20 text-center">
            <div>
              <span className="block font-['Space_Grotesk'] text-2xl font-bold tracking-[0.1em] text-white">
                4K_UHD
              </span>
              <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/40">
                Output_Precision
              </span>
            </div>

            <div>
              <span className="block font-['Space_Grotesk'] text-2xl font-bold tracking-[0.1em] text-white">
                24_FPS
              </span>
              <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/40">
                Temporal_Density
              </span>
            </div>

            <div>
              <span className="block font-['Space_Grotesk'] text-2xl font-bold tracking-[0.1em] text-white">
                ENGINE_X
              </span>
              <span className="mt-2 block text-[8px] font-bold uppercase tracking-[0.3em] text-mahi-accent/40">
                Processing_Core
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}