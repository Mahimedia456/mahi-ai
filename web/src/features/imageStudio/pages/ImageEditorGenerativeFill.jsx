import { useState } from "react";
import { createImageEditorJob, uploadEditorFile } from "../../../api/imageEditorApi";
import { useImageEditor } from "../context/ImageEditorContext";
import MaskCanvas from "../components/MaskCanvas";
import EditorJobStatus from "../components/EditorJobStatus";

export default function ImageEditorGenerativeFill() {
  const { inputPath, inputPreview, activeJob, setActiveJob } = useImageEditor();

  const [prompt, setPrompt] = useState("");
  const [strength, setStrength] = useState(0.55);
  const [maskFile, setMaskFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function applyFill() {
    if (!inputPath) {
      alert("Please upload an image first.");
      return;
    }

    if (!maskFile) {
      alert("Please paint and save mask first.");
      return;
    }

    try {
      setLoading(true);

      const maskPath = await uploadEditorFile("masks", maskFile);

      const job = await createImageEditorJob({
        toolType: "generative_fill",
        prompt,
        inputPath,
        maskPath,
        strength,
        meta: { mode: "fast" },
      });

      setActiveJob(job);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Failed to create generative fill job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Generative Fill
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Fill masked regions with prompt-guided inpainting using a lighter fast setup.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-mahi-accent/20 p-6">
          {inputPreview ? (
            <MaskCanvas imageUrl={inputPreview} onMaskReady={setMaskFile} />
          ) : (
            <div className="flex min-h-[480px] items-center justify-center border border-dashed border-mahi-accent/20">
              <div className="text-center">
                <div className="mb-6 text-6xl text-mahi-accent">+</div>
                <p className="theme-heading text-2xl font-bold uppercase tracking-[0.18em] text-white">
                  Upload Source First
                </p>
                <p className="mt-3 text-sm text-white/30">
                  Go to Home and upload your base image.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 border border-mahi-accent/20 p-8">
          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Fill Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-32 w-full border border-mahi-accent/30 bg-transparent p-4 text-sm text-white placeholder:text-white/20 outline-none"
              placeholder="Describe what should appear in the selected region..."
            />
          </div>

          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Blend Strength
            </label>
            <input
              type="range"
              min="0.25"
              max="0.8"
              step="0.05"
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-2 text-sm text-white/40">{strength.toFixed(2)}</p>
          </div>

          <div className="border border-mahi-accent/15 bg-black/30 p-4 text-sm text-white/35">
            Mask saved: {maskFile ? maskFile.name : "No mask yet"}
          </div>

          <button
            onClick={applyFill}
            disabled={loading}
            className="w-full border border-mahi-accent py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black disabled:opacity-50"
          >
            {loading ? "Applying..." : "Apply Fill"}
          </button>

          <EditorJobStatus job={activeJob} />
        </div>
      </div>
    </div>
  );
}