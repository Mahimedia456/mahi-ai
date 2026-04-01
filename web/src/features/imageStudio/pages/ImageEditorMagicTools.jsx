const tools = [
  {
    title: "Remove Background",
    desc: "Automatic subject extraction with clean edge isolation.",
  },
  {
    title: "Replace Background",
    desc: "Swap visual environments using neural reconstruction.",
  },
  {
    title: "Add Object",
    desc: "Insert objects naturally into the scene from text prompts.",
  },
  {
    title: "Erase Element",
    desc: "Remove unwanted visual components with contextual fill.",
  },
];

export default function ImageEditorMagicTools() {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="mb-10">
        <h1 className="theme-heading text-3xl font-bold uppercase tracking-[-0.06em] text-white">
          Magic Tools
        </h1>
        <p className="mt-3 max-w-2xl text-white/35">
          Remove background, replace assets, insert new objects, or refine scene structure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <button
            key={tool.title}
            className="border border-mahi-accent/20 bg-black/40 p-8 text-left transition-all hover:border-mahi-accent/50 hover:bg-mahi-accent/[0.03]"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center border border-mahi-accent/25 text-mahi-accent">
              ✦
            </div>
            <h3 className="theme-heading text-1xl font-bold uppercase tracking-[0.14em] text-white">
              {tool.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/35">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}