import { useState } from "react";
import { createImageEditorJob, uploadEditorFile } from "../../../api/imageEditorApi";
import { useImageEditor } from "../context/ImageEditorContext";
import EditorJobStatus from "../components/EditorJobStatus";
import MaskCanvas from "../components/MaskCanvas";

const tools = [
  {
    title: "Remove Background",
    key: "remove_background",
    desc: "Automatic subject extraction with clean edge isolation.",
    requiresMask: false,
  },
  {
    title: "Replace Background",
    key: "replace_background",
    desc: "Swap visual environments directly or with an optional mask.",
    requiresMask: false,
    supportsMask: true,
  },
  {
    title: "Add Object",
    key: "add_object",
    desc: "Insert objects naturally into a masked region.",
    requiresMask: true,
  },
  {
    title: "Erase Element",
    key: "erase_element",
    desc: "Remove unwanted visual components from a masked region.",
    requiresMask: true,
  },
];

export default function ImageEditorMagicTools() {
  const { inputPath, inputPreview, activeJob, setActiveJob } = useImageEditor();
  const [selectedTool, setSelectedTool] = useState("remove_background");
  const [prompt, setPrompt] = useState("");
  const [maskFile, setMaskFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedToolConfig = tools.find((tool) => tool.key === selectedTool);

  async function runTool() {
    if (!inputPath) {
      alert("Please upload an image first.");
      return;
    }

    if (selectedToolConfig?.requiresMask && !maskFile) {
      alert("Please paint and save mask first.");
      return;
    }

    try {
      setLoading(true);

      let maskPath = null;

      if ((selectedToolConfig?.requiresMask || selectedToolConfig?.supportsMask) && maskFile) {
        maskPath = await uploadEditorFile("masks", maskFile);
      }

      const job = await createImageEditorJob({
        toolType: selectedTool,
        prompt: prompt.trim() || null,
        inputPath,
        maskPath,
        strength:
          selectedTool === "replace_background"
            ? 0.75
            : selectedTool === "add_object" || selectedTool === "erase_element"
            ? 0.7
            : 0.65,
        meta: { mode: "fast" },
      });

      setActiveJob(job);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Magic Tools
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Remove background instantly, replace backgrounds directly, or use masked editing for insert and erase.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <button
                key={tool.title}
                onClick={() => {
                  setSelectedTool(tool.key);
                  setMaskFile(null);
                }}
                className={`border p-8 text-left transition-all ${
                  selectedTool === tool.key
                    ? "border-mahi-accent bg-mahi-accent/[0.06]"
                    : "border-mahi-accent/20 bg-black/40 hover:border-mahi-accent/50 hover:bg-mahi-accent/[0.03]"
                }`}
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center border border-mahi-accent/25 text-mahi-accent">
                  ✦
                </div>
                <h3 className="theme-heading text-xl font-bold uppercase tracking-[0.14em] text-white">
                  {tool.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/35">{tool.desc}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {tool.requiresMask ? "Mask required" : tool.supportsMask ? "Mask optional" : "Fast tool"}
                </p>
              </button>
            ))}
          </div>

          {(selectedToolConfig?.requiresMask || selectedToolConfig?.supportsMask) ? (
            <div className="border border-mahi-accent/20 p-6">
              {inputPreview ? (
                <MaskCanvas imageUrl={inputPreview} onMaskReady={setMaskFile} />
              ) : (
                <div className="flex min-h-[300px] items-center justify-center text-sm text-white/30">
                  Upload source image from Home first.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="space-y-6 border border-mahi-accent/20 p-6">
          <div className="border border-mahi-accent/15 bg-black/30 p-4">
            {inputPreview ? (
              <img
                src={inputPreview}
                alt="Selected source"
                className="max-h-[320px] w-full object-contain"
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center text-sm text-white/30">
                Upload source image from Home first.
              </div>
            )}
          </div>

          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Active Tool
            </label>
            <div className="border border-mahi-accent/20 px-4 py-3 text-sm uppercase tracking-[0.14em] text-white">
              {selectedTool.replaceAll("_", " ")}
            </div>
          </div>

          {selectedTool !== "remove_background" ? (
            <div>
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-32 w-full border border-mahi-accent/30 bg-transparent p-4 text-sm text-white placeholder:text-white/20 outline-none"
                placeholder="Describe the change clearly, for example: luxury Burj Khalifa skyline at sunset background / add a realistic wall clock / remove necktie"
              />
            </div>
          ) : null}

          {(selectedToolConfig?.requiresMask || selectedToolConfig?.supportsMask) ? (
            <div className="border border-mahi-accent/15 bg-black/30 p-4 text-sm text-white/35">
              Mask saved: {maskFile ? maskFile.name : "No mask yet"}
            </div>
          ) : null}

          <button
            onClick={runTool}
            disabled={loading}
            className="w-full border border-mahi-accent py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Run Magic Tool"}
          </button>

          <EditorJobStatus job={activeJob} />
        </div>
      </div>
    </div>
  );
}