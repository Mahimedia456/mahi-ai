import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Film, Zap } from "lucide-react";

const durations = ["04.0s", "08.0s", "12.0s"];
const styles = ["CINEMATIC_ENGINE", "SMOOTH_MOTION", "DRAMATIC_REALISM"];

export default function VideoStudioFrameToVideo() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState("08.0s");
  const [style, setStyle] = useState("SMOOTH_MOTION");

  return (
    <section className="flex h-[calc(100vh-144px)] overflow-hidden">
      <aside className="w-full shrink-0 border-r border-mahi-accent/20 px-8 py-10 md:w-[360px]">
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Source Frame
            </label>

            <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-mahi-accent/20 p-6 text-center transition-all hover:border-mahi-accent/50">
              <div className="mb-5 flex h-16 w-16 items-center justify-center border border-mahi-accent/25 text-mahi-accent">
                <ImagePlus size={28} />
              </div>
              <h3 className="theme-heading text-xl font-bold uppercase tracking-[0.14em] text-white">
                Upload Frame
              </h3>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
                PNG / JPG / WEBP
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Motion Prompt
            </label>
            <textarea
              className="min-h-[120px] w-full resize-none border border-mahi-accent/20 bg-transparent p-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-mahi-accent"
              placeholder="Describe how the frame should animate..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((item) => (
                <button
                  key={item}
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
              Motion Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full border border-mahi-accent/20 bg-transparent p-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white outline-none"
            >
              {styles.map((item) => (
                <option key={item} className="bg-black">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => navigate("/app/video-studio/generating")}
            className="flex w-full items-center justify-center gap-3 border border-mahi-accent bg-mahi-accent/5 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black"
          >
            <Film size={15} />
            Animate_Frame
          </button>
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
          <div className="mb-8 flex h-24 w-24 items-center justify-center border border-mahi-accent/25 text-mahi-accent">
            <Zap size={34} />
          </div>

          <h2 className="theme-heading text-3xl font-medium uppercase tracking-[0.12em] text-white">
            Frame Motion Standby
          </h2>
          <p className="mt-4 max-w-md text-[10px] uppercase tracking-[0.18em] text-white/28">
            UPLOAD_A_SINGLE_FRAME // DEFINE_MOTION_TRAJECTORY // INITIALIZE_VIDEO_SYNTHESIS
          </p>
        </div>
      </section>
    </section>
  );
}