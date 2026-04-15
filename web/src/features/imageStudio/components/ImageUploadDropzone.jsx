import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadEditorFile } from "../../../api/imageEditorApi";
import { useImageEditor } from "../context/ImageEditorContext";

export default function ImageUploadDropzone() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setInputFile, setInputPath, setInputPreview } = useImageEditor();

  async function handleFile(file) {
    if (!file) return;

    try {
      setError("");
      setLoading(true);

      const preview = URL.createObjectURL(file);
      const path = await uploadEditorFile("inputs", file);

      setInputFile(file);
      setInputPreview(preview);
      setInputPath(path);
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  }

  function onChange(event) {
    const file = event.target.files?.[0];
    handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className="group relative cursor-pointer overflow-hidden border border-mahi-accent/20 p-20 transition-all duration-700 hover:border-mahi-accent/60"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={onChange}
      />

      <div className="absolute inset-0 bg-mahi-accent/[0.01] transition-colors group-hover:bg-mahi-accent/[0.03]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-10 flex h-24 w-24 items-center justify-center border border-mahi-accent/20 transition-all duration-500 group-hover:border-mahi-accent">
          {loading ? (
            <Loader2 size={48} className="animate-spin text-mahi-accent" />
          ) : (
            <ImagePlus size={48} className="text-mahi-accent" />
          )}
        </div>

        <h3 className="theme-heading text-3xl font-bold uppercase tracking-[0.2em] text-white">
          Input Source
        </h3>

        <p className="mb-6 mt-4 text-xs uppercase tracking-[0.24em] text-white/25">
          DRAG DATA OR BROWSE (PNG / JPG / WEBP)
        </p>

        <button
          type="button"
          className="bg-mahi-accent px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white"
        >
          Browse Files
        </button>

        {error ? <p className="mt-5 text-sm text-red-400">{error}</p> : null}
      </div>
    </div>
  );
}