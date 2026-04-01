import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-page flex min-h-screen flex-col">
      <header className="fixed left-0 right-0 top-0 z-50 bg-transparent">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
          <div
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Mahi AI
          </div>

          <button
            className="text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:text-mahi-accent"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            SUPPORT
          </button>
        </nav>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-20">
        <Outlet />
      </main>

      <footer className="w-full bg-transparent py-8 text-white/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-8 md:flex-row">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            © 2024 MAHI AI. ENGINEERED FOR INTELLIGENCE.
          </span>

          <div className="mt-4 flex gap-8 md:mt-0">
            <a
              href="#"
              className="auth-footer-link"
            >
              PRIVACY POLICY
            </a>
            <a
              href="#"
              className="auth-footer-link"
            >
              TERMS OF SERVICE
            </a>
            <a
              href="#"
              className="auth-footer-link"
            >
              SECURITY
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}