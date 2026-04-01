const upscaleItems = [
  { title: "2x Upscale", desc: "Fast neural detail enhancement." },
  { title: "4x Upscale", desc: "Sharper lines and texture recovery." },
  { title: "Face Enhance", desc: "Portrait clarity and identity-safe cleanup." },
  { title: "Noise Reduction", desc: "Cleaner low-light detail restoration." },
];

export default function ImageEditorUpscale() {
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {upscaleItems.map((item) => (
          <button
            key={item.title}
            className="border border-mahi-accent/20 p-8 text-left transition-all hover:border-mahi-accent/50 hover:bg-mahi-accent/[0.03]"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center border border-mahi-accent/20 text-mahi-accent">
              ↑
            </div>
            <h3 className="theme-heading text-1xl font-bold uppercase tracking-[0.14em] text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/35">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}