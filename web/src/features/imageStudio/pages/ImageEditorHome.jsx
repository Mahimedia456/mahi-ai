import { Link } from "react-router-dom";
import { Sparkles, Wand2, ScanSearch, ArrowUpCircle, UploadCloud } from "lucide-react";
import ImageUploadDropzone from "../components/ImageUploadDropzone";
import { useImageEditor } from "../context/ImageEditorContext";

const actions = [
  {
    title: "Generative Fill",
    desc: "Mask an area and regenerate it with prompt-guided inpainting.",
    to: "/image-editor/generative-fill",
    icon: ScanSearch,
  },
  {
    title: "Magic Tools",
    desc: "Remove background, replace background, add objects, and erase elements.",
    to: "/image-editor/magic-tools",
    icon: Wand2,
  },
  {
    title: "Upscale",
    desc: "Sharpen details, increase resolution, reduce noise, and improve portraits.",
    to: "/image-editor/upscale",
    icon: ArrowUpCircle,
  },
];

export default function ImageEditorHome() {
  const { inputPreview, inputPath } = useImageEditor();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-[#53f5e7]/12 bg-[#0b0b0b]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#53f5e7]/20 bg-[#53f5e7]/[0.05] text-[#53f5e7]">
              <UploadCloud size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#53f5e7]">
                Input Source
              </p>
              <h2
                className="mt-1 text-xl font-extrabold uppercase tracking-[-0.04em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Upload Base Image
              </h2>
            </div>
          </div>

          <ImageUploadDropzone />
        </div>

        <div className="rounded-[28px] border border-[#53f5e7]/12 bg-[#0b0b0b]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#53f5e7]">
                Source Preview
              </p>
              <h2
                className="mt-1 text-xl font-extrabold uppercase tracking-[-0.04em] text-white"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Ready for Editing
              </h2>
            </div>

            {inputPath ? (
              <span className="rounded-full border border-[#53f5e7]/25 bg-[#53f5e7]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#53f5e7]">
                Uploaded
              </span>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Waiting
              </span>
            )}
          </div>

          <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-[#53f5e7]/15 bg-black/40 p-5">
            {inputPreview ? (
              <img
                src={inputPreview}
                alt="Uploaded source"
                className="max-h-[380px] w-full rounded-[18px] object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#53f5e7]/15 bg-[#53f5e7]/[0.03] text-[#53f5e7]">
                  <Sparkles size={24} />
                </div>
                <p className="mt-5 text-sm font-medium text-white/55">
                  Upload an image to activate the editing workflow.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/25">
                  PNG / JPG / WEBP
                </p>
              </div>
            )}
          </div>

          {inputPath ? (
            <p className="mt-4 break-all text-xs leading-6 text-white/25">
              {inputPath}
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#53f5e7]/12 bg-[#0b0b0b]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]">
            Editor Tools
          </p>
          <h2
            className="mt-2 text-2xl font-extrabold uppercase tracking-[-0.04em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Choose Your Workflow
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/40">
            Start with one of the core workflows below. After uploading a source image,
            move into detailed editing, cleanup, inpainting, or enhancement.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-[24px] border border-[#53f5e7]/12 bg-black/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#53f5e7]/40 hover:bg-[#53f5e7]/[0.04]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#53f5e7]/15 bg-[#53f5e7]/[0.04] text-[#53f5e7] transition-all duration-300 group-hover:border-[#53f5e7]/35 group-hover:bg-[#53f5e7]/10">
                  <Icon size={20} />
                </div>

                <h3
                  className="mt-6 text-lg font-extrabold uppercase tracking-[0.04em] text-white"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/40">
                  {item.desc}
                </p>

                <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#53f5e7]">
                  Open Tool
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}