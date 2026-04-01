export default function AuthCard({ icon = "🔒", title, subtitle, children, footer }) {
  return (
    <div className="auth-card">
      <div className="flex flex-col items-center px-10 pb-12 pt-14">
        <div className="theme-icon-glow mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-mahi-surfaceHigh/80">
          <span className="text-2xl text-mahi-accent">{icon}</span>
        </div>

        <h1 className="auth-title mb-2">{title}</h1>
        <p className="auth-subtitle mb-10">{subtitle}</p>

        <div className="w-full">{children}</div>

        {footer ? <div className="mt-10">{footer}</div> : null}
      </div>
    </div>
  );
}