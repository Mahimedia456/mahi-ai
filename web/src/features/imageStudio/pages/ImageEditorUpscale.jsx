import { useState } from "react";
import { createImageEditorJob } from "../../../api/imageEditorApi";
import { useImageEditor } from "../context/ImageEditorContext";
import EditorJobStatus from "../components/EditorJobStatus";

const upscaleItems = [
  { title: "2x Upscale", key: "upscale", scaleFactor: 2, desc: "Fast neural detail enhancement." },
  { title: "4x Upscale", key: "upscale", scaleFactor: 4, desc: "Sharper lines and texture recovery." },
  { title: "Face Enhance", key: "face_enhance", scaleFactor: 2, desc: "Portrait clarity and identity-safe cleanup." },
  { title: "Noise Reduction", key: "noise_reduction", scaleFactor: 2, desc: "Cleaner low-light detail restoration." },
];

export default function ImageEditorUpscale() {
  const { inputPath, inputPreview, activeJob, setActiveJob } = useImageEditor();
  const [loadingKey, setLoadingKey] = useState("");

  async function runItem(item) {
    if (!inputPath) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setLoadingKey(item.title);

      const job = await createImageEditorJob({
        toolType: item.key,
        inputPath,
        scaleFactor: item.scaleFactor,
        faceEnhance: item.key === "face_enhance",
        denoise: item.key === "noise_reduction",
        meta: { mode: "fast" },
      });

      setActiveJob(job);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Failed to create upscale job");
    } finally {
      setLoadingKey("");
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Upscale
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Increase image fidelity, sharpen textures, and prepare outputs for final delivery.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {upscaleItems.map((item) => (
            <button
              key={item.title}
              onClick={() => runItem(item)}
              disabled={loadingKey === item.title}
              className="border border-mahi-accent/20 p-8 text-left transition-all hover:border-mahi-accent/50 hover:bg-mahi-accent/[0.03] disabled:opacity-50"
            >
              <div className="mb-8 flex h-12 w-12 items-center justify-center border border-mahi-accent/20 text-mahi-accent">
                ↑
              </div>
              <h3 className="theme-heading text-xl font-bold uppercase tracking-[0.14em] text-white">
                {loadingKey === item.title ? "Submitting..." : item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/35">{item.desc}</p>
            </button>
          ))}
        </div>

        <div className="space-y-6 border border-mahi-accent/20 p-6">
          <div className="border border-mahi-accent/15 bg-black/30 p-4">
            {inputPreview ? (
              <img
                src={inputPreview}
                alt="Source Preview"
                className="max-h-[360px] w-full object-contain"
              />
            ) : (
              <div className="flex min-h-[360px] items-center justify-center text-sm text-white/30">
                Upload source image from Home first.
              </div>
            )}
          </div>

          <EditorJobStatus job={activeJob} />
        </div>
      </div>
    </div>
  );
}