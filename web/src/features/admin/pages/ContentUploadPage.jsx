import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { uploadAdminContent } from "../../../api/adminContentApi";

const initialForm = {
  title: "",
  type: "image",
  userName: "",
  userEmail: "",
  model: "",
  prompt: "",
  status: "approved",
  visibility: "private",
  moderationNote: "",
  resolution: "",
  format: "",
};

function InputLabel({ children }) {
  return (
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a9794]">
      {children}
    </label>
  );
}

function PreviewMedia({ file, previewUrl, selectedType }) {
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [previewUrl, file, selectedType]);

  if (!previewUrl) {
    return (
      <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm text-[#8d9a97]">
        Select an image or video file to preview before upload.
      </div>
    );
  }

  const fileType = file?.type || "";
  const isVideo =
    selectedType === "video" ||
    fileType.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|m4v)$/i.test(file?.name || "");

  if (isVideo) {
    if (mediaError) {
      return (
        <div className="flex h-[420px] flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-semibold text-white">
            Video preview could not be played in the browser.
          </p>
          <p className="mt-2 max-w-md text-xs leading-6 text-[#8d9a97]">
            This usually happens when the uploaded format or codec is not supported by the browser.
            Try MP4 with H.264 for best compatibility.
          </p>
        </div>
      );
    }

    return (
      <video
        key={previewUrl}
        controls
        playsInline
        preload="metadata"
        className="h-[420px] w-full bg-black object-contain"
        onError={() => setMediaError(true)}
      >
        <source src={previewUrl} type={fileType || "video/mp4"} />
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <img
      src={previewUrl}
      alt="Preview"
      className="h-[420px] w-full object-contain"
      onError={() => setMediaError(true)}
    />
  );
}

export default function ContentUploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const accept = useMemo(() => {
    return form.type === "video"
      ? "video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov,.m4v"
      : "image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif";
  }, [form.type]);

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selected) {
      const inferredType = selected.type.startsWith("video/") ? "video" : "image";
      setForm((prev) => ({
        ...prev,
        type: inferredType,
        format: prev.format || selected.type || "",
      }));
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl("");
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("file", file);

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      const res = await uploadAdminContent(formData);
      navigate(`/admin/content/${res.item.id}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-7 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#53f5e7]/80">
              Content Management
            </p>
            <h1
              className="mt-3 text-[34px] font-extrabold tracking-[-0.04em] text-white"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Upload Content Asset
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9eaaa7]">
              Upload generated images or videos to storage and register them in the admin content system.
            </p>
          </div>

          <Link
            to="/admin/content/images"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Content
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl"
        >
          <h2
            className="text-[22px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Asset Details
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <InputLabel>Title</InputLabel>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter asset title"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div>
              <InputLabel>Type</InputLabel>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <InputLabel>Status</InputLabel>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="approved">Approved</option>
                <option value="reported">Reported</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div>
              <InputLabel>Visibility</InputLabel>
              <select
                value={form.visibility}
                onChange={(e) => updateField("visibility", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="workspace">Workspace</option>
              </select>
            </div>

            <div>
              <InputLabel>Model</InputLabel>
              <input
                type="text"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
                placeholder="ex: gpt-image, sora, runway"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div>
              <InputLabel>User Name</InputLabel>
              <input
                type="text"
                value={form.userName}
                onChange={(e) => updateField("userName", e.target.value)}
                placeholder="Enter user name"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div>
              <InputLabel>User Email</InputLabel>
              <input
                type="email"
                value={form.userEmail}
                onChange={(e) => updateField("userEmail", e.target.value)}
                placeholder="Enter user email"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div>
              <InputLabel>Resolution</InputLabel>
              <input
                type="text"
                value={form.resolution}
                onChange={(e) => updateField("resolution", e.target.value)}
                placeholder="1024x1024 or 1920x1080"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div>
              <InputLabel>Format</InputLabel>
              <input
                type="text"
                value={form.format}
                onChange={(e) => updateField("format", e.target.value)}
                placeholder="image/png or video/mp4"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div className="md:col-span-2">
              <InputLabel>Prompt</InputLabel>
              <textarea
                rows={5}
                value={form.prompt}
                onChange={(e) => updateField("prompt", e.target.value)}
                placeholder="Enter generation prompt"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div className="md:col-span-2">
              <InputLabel>Moderation Note</InputLabel>
              <textarea
                rows={4}
                value={form.moderationNote}
                onChange={(e) => updateField("moderationNote", e.target.value)}
                placeholder="Optional admin note"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6f7b78]"
              />
            </div>

            <div className="md:col-span-2">
              <InputLabel>Upload File</InputLabel>
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[#53f5e7] file:px-4 file:py-2 file:text-sm file:font-bold file:text-black"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-[#53f5e7] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
            >
              {submitting ? "Uploading..." : "Upload Asset"}
            </button>

            <Link
              to="/admin/content/images"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Cancel
            </Link>
          </div>
        </form>

        <div className="rounded-[28px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-6 backdrop-blur-xl">
          <h2
            className="text-[22px] font-bold tracking-[-0.03em] text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Preview
          </h2>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#111111]">
            <PreviewMedia file={file} previewUrl={previewUrl} selectedType={form.type} />
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#84918d]">Selected File</p>
              <p className="mt-2 text-sm text-white">{file?.name || "No file selected"}</p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#84918d]">Type & Visibility</p>
              <p className="mt-2 text-sm text-white">
                {form.type} · {form.visibility}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#151515] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#84918d]">Detected MIME Type</p>
              <p className="mt-2 text-sm text-white">{file?.type || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}