import { Download, HelpCircle } from "lucide-react";

const invoices = [
  { id: "INV-92842", date: "Sept 24, 2024", value: "$29.00", status: "Authorized" },
  { id: "INV-81723", date: "Aug 24, 2024", value: "$29.00", status: "Authorized" },
  { id: "INV-70651", date: "July 24, 2024", value: "$29.00", status: "Authorized" },
];

export default function BillingPage() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(83,245,231,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(83,245,231,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <header className="sticky top-16 z-20 border-b border-mahi-accent/10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="theme-heading text-lg font-medium uppercase tracking-[0.2em] text-white">
            System / <span className="text-mahi-accent">Billing</span>
          </h2>

          <div className="flex items-center space-x-8">
            <button className="relative text-white/40 transition-colors hover:text-mahi-accent">
              •
              <span className="absolute -right-1 -top-1 h-1 w-1 rounded-full bg-mahi-accent" />
            </button>
            <button className="text-white/40 transition-colors hover:text-mahi-accent">
              <HelpCircle size={18} />
            </button>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden border border-mahi-accent/30 bg-white/5" />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl space-y-16 p-8">
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="border-l-2 border-mahi-accent py-4 pl-8 lg:col-span-2">
            <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-mahi-accent">
              Deployment Tier
            </span>

            <h3 className="theme-heading mb-4 text-6xl font-bold uppercase tracking-tight text-white">
              Pro Plan
            </h3>

            <div className="mb-8 flex items-center space-x-6 text-xs uppercase tracking-widest text-white/40">
              <span>Monthly Billing</span>
              <span className="text-mahi-accent">/</span>
              <span>Renewal: Oct 24, 2024</span>
            </div>

            <div className="flex items-center space-x-12">
              <div className="flex items-baseline space-x-1">
                <span className="theme-heading text-5xl font-bold text-white">$29</span>
                <span className="text-xs font-bold uppercase tracking-widest text-mahi-accent">
                  / Month
                </span>
              </div>

              <button className="border border-mahi-accent px-10 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-mahi-accent transition-all duration-300 hover:bg-mahi-accent hover:text-black">
                Upgrade Protocol
              </button>
            </div>
          </div>

          <div className="border border-mahi-accent/20 p-8">
            <h4 className="mb-6 text-[10px] uppercase tracking-[0.3em] text-mahi-accent">
              Tier Privileges
            </h4>
            <ul className="space-y-4">
              {["Priority GPU Node", "Ultra-HD Generation", "Real-time Support"].map((item) => (
                <li key={item} className="flex items-center text-[11px] uppercase tracking-widest text-white/55">
                  <span className="mr-3 text-mahi-accent">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-mahi-accent/10 pt-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h3 className="theme-heading text-2xl font-bold uppercase tracking-[0.2em] text-white">
                Resource Analysis
              </h3>
              <div className="mt-2 h-px w-32 bg-[linear-gradient(90deg,#53f5e7_0%,transparent_100%)]" />
            </div>

            <div className="text-right">
              <span className="mb-1 block text-[9px] uppercase tracking-[0.3em] text-mahi-accent">
                Reset Sequence
              </span>
              <span className="theme-heading text-lg font-bold uppercase text-white">
                T-Minus 12 Days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <Metric label="Neural Exchanges" value="842" total="1,000" width="84%" color="cyan" />
            <Metric label="Visual Synthesis" value="156" total="500" width="31%" color="cyan" />
            <Metric label="Motion Render" value="48" total="50" width="96%" color="red" />
          </div>
        </section>

        <section className="border-t border-mahi-accent/10 pt-8">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="theme-heading text-2xl font-bold uppercase tracking-[0.2em] text-white">
              Log: Transaction History
            </h3>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              SECURE_ENCRYPTION_ACTIVE
            </span>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-mahi-accent/20">
                {["Record ID", "Timestamp", "Value", "Status", "Data"].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-6 text-[10px] font-medium uppercase tracking-[0.3em] text-mahi-accent"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-mahi-accent/5">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-mahi-accent/5 transition-colors hover:bg-mahi-accent/5">
                  <td className="px-4 py-6 text-xs uppercase tracking-widest text-white">
                    {invoice.id}
                  </td>
                  <td className="px-4 py-6 text-xs uppercase tracking-tight text-white/50">
                    {invoice.date}
                  </td>
                  <td className="px-4 py-6 text-xs font-bold text-white">{invoice.value}</td>
                  <td className="px-4 py-6">
                    <span className="border border-mahi-accent/30 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-mahi-accent">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-right">
                    <button className="text-white/40 transition-colors hover:text-mahi-accent">
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, total, width, color = "cyan" }) {
  const barClass =
    color === "red"
      ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
      : "bg-mahi-accent shadow-[0_0_10px_rgba(83,245,231,0.5)]";

  const textClass = color === "red" ? "text-red-500" : "text-mahi-accent";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
        <span className="text-white/60">{label}</span>
        <span className={textClass}>
          {value} <span className="opacity-40">/</span> {total}
        </span>
      </div>
      <div className="h-[2px] w-full overflow-hidden bg-white/5">
        <div className={`h-full ${barClass}`} style={{ width }} />
      </div>
    </div>
  );
}