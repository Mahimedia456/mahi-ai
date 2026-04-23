import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Film, Zap } from "lucide-react";
import {
  createVideoStudioJob,
  createVideoStudioUploadUrl,
  uploadFileToSignedUrl,
} from "../../../api/videoStudio.api";

const durations = ["04.0s", "08.0s", "12.0s"];
const styles = ["CINEMATIC_ENGINE", "SMOOTH_MOTION", "DRAMATIC_REALISM"];

export default function VideoStudioFrameToVideo() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [duration, setDuration] = useState("08.0s");
  const [style, setStyle] = useState("SMOOTH_MOTION");
  const [motionPrompt, setMotionPrompt] = useState("");
  const [sourceFile, setSourceFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSourceFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleGenerate() {
    try {
      setError("");

      if (!sourceFile) {
        setError("Source frame is required.");
        return;
      }

      if (!motionPrompt.trim()) {
        setError("Motion prompt is required.");
        return;
      }

      setLoading(true);

      const uploadRes = await createVideoStudioUploadUrl({
        kind: "inputs",
        fileName: sourceFile.name,
        contentType: sourceFile.type || "image/png",
      });

      const uploadData = uploadRes?.data;
      if (!uploadData?.signedUrl || !uploadData?.path) {
        throw new Error("Failed to prepare upload URL.");
      }

      await uploadFileToSignedUrl({
        signedUrl: uploadData.signedUrl,
        token: uploadData.token,
        file: sourceFile,
        contentType: sourceFile.type || "image/png",
      });

      const jobRes = await createVideoStudioJob({
        title: "Frame to Video",
        mode: "frame_to_video",
        motionPrompt,
        inputImagePath: uploadData.path,
        durationSeconds: Number(duration.replace("s", "")),
        aspectRatio: "16:9",
        fps: 24,
        resolution: "720p",
        style,
        motionStrength: 50,
        meta: {
          source: "video_studio_frame_to_video",
          originalFileName: sourceFile.name,
        },
      });

      const job = jobRes?.data;
      if (!job?.id) {
        throw new Error("Job was created but no job ID was returned.");
      }

      navigate(`/app/video-studio/generating?jobId=${job.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create frame-to-video job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-[calc(100vh-144px)] overflow-hidden">
      <aside className="w-full shrink-0 border-r border-mahi-accent/20 px-8 py-10 md:w-[360px]">
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Source Frame
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={handleChooseFile}
              className="flex min-h-[180px] w-full flex-col items-center justify-center border border-dashed border-mahi-accent/20 p-6 text-center transition-all hover:border-mahi-accent/50"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Source preview"
                  className="max-h-[180px] w-full object-contain"
                />
              ) : (
                <>
                  <div className="mb-5 flex h-16 w-16 items-center justify-center border border-mahi-accent/25 text-mahi-accent">
                    <ImagePlus size={28} />
                  </div>
                  <h3 className="theme-heading text-xl font-bold uppercase tracking-[0.14em] text-white">
                    Upload Frame
                  </h3>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/25">
                    PNG / JPG / WEBP
                  </p>
                </>
              )}
            </button>

            {sourceFile ? (
              <p className="text-xs text-white/50">{sourceFile.name}</p>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Motion Prompt
            </label>
            <textarea
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              className="min-h-[120px] w-full resize-none border border-mahi-accent/20 bg-transparent p-4 text-xs text-white placeholder:text-white/20 outline-none focus:border-mahi-accent"
              placeholder="Describe how the frame should animate..."
            />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-mahi-accent/70">
              Duration
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
            onClick={handleGenerate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 border border-mahi-accent bg-mahi-accent/5 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Film size={15} />
            {loading ? "Uploading_And_Creating..." : "Animate_Frame"}
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