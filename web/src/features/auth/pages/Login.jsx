import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuthStore } from "../../../store/authStore";

const ADMIN_EMAIL = "admin@mahimediasolutions.com";
const ADMIN_PASSWORD = "Admin@123456";

const USER_EMAIL = "user@mahimediasolutions.com";
const USER_PASSWORD = "User@123456";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function loginAsAdmin() {
    setForm({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    setError("");
  }

  function loginAsUser() {
    setForm({
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      const role = res.data.user.role;

      if (role === "admin" || role === "super_admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
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
      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={loginAsAdmin}
          className="rounded-[16px] border border-mahi-accent/30 bg-mahi-accent/10 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-mahi-accent transition-all hover:bg-mahi-accent/15"
        >
          Admin Login
        </button>

        <button
          type="button"
          onClick={loginAsUser}
          className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white transition-all hover:border-mahi-accent/30 hover:text-mahi-accent"
        >
          User Login
        </button>
      </div>

      <form className="w-full space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <label className="theme-label">Email Address</label>
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

        {error ? (
          <div className="rounded-[16px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] font-medium text-red-300">
            {error}
          </div>
        ) : null}

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
          disabled={loading}
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}