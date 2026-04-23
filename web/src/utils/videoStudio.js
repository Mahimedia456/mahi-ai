export function getModeLabel(mode) {
  if (mode === "frame_to_video") return "Frame to Video";
  return "Text to Video";
}

export function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "text-emerald-400";
    case "processing":
      return "text-mahi-accent";
    case "queued":
      return "text-yellow-300";
    case "failed":
      return "text-red-400";
    default:
      return "text-white/40";
  }
}

export function getRelativeTime(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hour ago`;
  if (diffMs < day * 2) return "Yesterday";

  return `${Math.floor(diffMs / day)} days ago`;
}

export function buildVideoTitleFromPrompt(prompt = "", fallback = "Video Generation") {
  const clean = String(prompt).trim();
  if (!clean) return fallback;
  return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean;
}

export function parseAspectRatioToDimensions(aspectRatio = "16:9") {
  switch (aspectRatio) {
    case "9:16":
      return { width: 720, height: 1280 };
    case "1:1":
      return { width: 1024, height: 1024 };
    case "4:5":
      return { width: 864, height: 1080 };
    case "16:9":
    default:
      return { width: 1280, height: 720 };
  }
}