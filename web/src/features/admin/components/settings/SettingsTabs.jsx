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
          onClick={() => setActive(tab.id)}
          className={[
            "rounded-xl px-4 py-2 text-xs font-semibold transition",
            active === tab.id
              ? "bg-[#53f5e7]/10 text-[#53f5e7]"
              : "bg-[#1b1b1b] text-[#9aa7a4] hover:text-white",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}