import { useEffect, useRef, useState } from "react";

export default function MaskCanvas({ imageUrl, onMaskReady }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(36);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [imageUrl]);

  function getPosition(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    return { x, y };
  }

  function draw(event) {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPosition(event);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  }

  function clearMask() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onMaskReady?.(null);
  }

  async function saveMask() {
    const canvas = canvasRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    const exportCtx = exportCanvas.getContext("2d");
    exportCtx.fillStyle = "#000000";
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));

    if (!blob) return;

    const file = new File([blob], `mask-${Date.now()}.png`, {
      type: "image/png",
    });

    onMaskReady?.(file);
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden border border-mahi-accent/20">
        <img src={imageUrl} alt="Source" className="block w-full" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onMouseDown={(e) => {
            setDrawing(true);
            draw(e);
          }}
          onMouseMove={draw}
          onMouseUp={() => setDrawing(false)}
          onMouseLeave={() => setDrawing(false)}
          onTouchStart={(e) => {
            setDrawing(true);
            draw(e);
          }}
          onTouchMove={draw}
          onTouchEnd={() => setDrawing(false)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-xs uppercase tracking-[0.2em] text-mahi-accent">
          Brush Size
        </label>

        <input
          type="range"
          min="8"
          max="120"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />

        <span className="text-sm text-white/60">{brushSize}px</span>

        <button
          type="button"
          onClick={clearMask}
          className="border border-mahi-accent/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white"
        >
          Clear Mask
        </button>

        <button
          type="button"
          onClick={saveMask}
          className="border border-mahi-accent bg-mahi-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black"
        >
          Save Mask
        </button>
      </div>
    </div>
  );
}