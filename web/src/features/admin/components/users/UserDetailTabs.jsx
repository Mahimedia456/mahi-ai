const tabs = [
  { id: "profile", label: "Profile" },
  { id: "subscription", label: "Subscription" },
  { id: "usage", label: "Usage" },
  { id: "billing", label: "Billing" }
];

export default function UserDetailTabs({ activeTab, onChange }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-[24px] border border-[#53f5e7]/10 bg-[#1b1b1b]/75 p-2 backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-[18px] px-5 py-3 text-sm font-bold tracking-[0.02em] transition-all ${
                isActive
                  ? "bg-[#53f5e7] text-black shadow-[0_0_24px_rgba(83,245,231,0.18)]"
                  : "text-[#a8b3b0] hover:bg-white/[0.04] hover:text-white"
              }`}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}