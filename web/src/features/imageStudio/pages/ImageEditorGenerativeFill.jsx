export default function ImageEditorGenerativeFill() {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Generative Fill
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Expand compositions, fill masked regions, and regenerate missing areas with prompt-based context.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-mahi-accent/20 p-10">
          <div className="flex min-h-[480px] items-center justify-center border border-dashed border-mahi-accent/20">
            <div className="text-center">
              <div className="mb-6 text-6xl text-mahi-accent">+</div>
              <p className="theme-heading text-2xl font-bold uppercase tracking-[0.18em] text-white">
                Mask Region
              </p>
              <p className="mt-3 text-sm text-white/30">
                Paint an area to fill using neural synthesis.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border border-mahi-accent/20 p-8">
          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Fill Prompt
            </label>
            <textarea
              className="h-32 w-full border border-mahi-accent/30 bg-transparent p-4 text-sm text-white placeholder:text-white/20 outline-none"
              placeholder="Describe what should appear in the selected region..."
            />
          </div>

          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
              Blend Strength
            </label>
            <div className="h-px bg-white/15">
              <div className="h-px w-2/3 bg-mahi-accent" />
            </div>
          </div>

          <button className="w-full border border-mahi-accent py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-mahi-accent transition-all hover:bg-mahi-accent hover:text-black">
            Apply Fill
          </button>
        </div>
      </div>
    </div>
  );
}