const tabs = [
  { id: "general", label: "General" },
  { id: "email", label: "Email" },
  { id: "ai", label: "AI Limits" },
  { id: "moderation", label: "Moderation" },
  { id: "blocked", label: "Blocked Words" },
  { id: "admins", label: "Admin Users" },
  { id: "roles", label: "Roles" },
];

export default function SettingsTabs({ active, setActive }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActive(tab.id)}
          className={[
            "rounded-xl px-4 py-2.5 text-xs font-semibold transition-all",
            active === tab.id
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