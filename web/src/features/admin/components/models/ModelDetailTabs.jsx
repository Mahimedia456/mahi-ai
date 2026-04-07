const tabs = [
  { id: "overview", label: "Overview" },
  { id: "usage", label: "Usage" },
  { id: "config", label: "Config" },
  { id: "activity", label: "Activity" },
];

export default function ModelDetailTabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
            activeTab === tab.id
              ? "bg-[#53f5e7]/10 text-[#53f5e7] shadow-[inset_0_0_0_1px_rgba(83,245,231,0.18)]"
              : "bg-[#1b1b1b] text-[#92a19d] hover:text-white",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}