import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Temporary frontend auth
    localStorage.setItem("mahi_auth_token", "true");
    localStorage.setItem(
      "mahi_user",
      JSON.stringify({
        email: form.email,
      })
    );

    navigate("/app", { replace: true });
  }

  return (
    <AuthCard
      icon="🔒"
      title="Welcome Back"
      subtitle="Sign in to continue to your AI workspace."
      footer={
        <p className="text-[12px] text-mahi-textMuted2">
          Don&apos;t have an account?
          <Link
            to="/register"
            className="ml-1 font-bold text-white transition-colors hover:text-mahi-accent"
          >
            Create Account
          </Link>
        </p>
      }
    >
      <form className="w-full space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <label className="theme-label">Email Address</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="theme-input"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="theme-label">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="theme-input pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mahi-textMuted2/60 transition-colors hover:text-mahi-accent"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="-mt-3 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-[11px] font-bold uppercase tracking-wider text-mahi-accent transition-colors hover:text-mahi-accent/80"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest"
        >
          Sign In
        </button>
      </form>
    </AuthCard>
  );
}