import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { authApi } from "../../../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("mahi_verify_email");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem("mahi_otp_verified") === "true";
    if (!isVerified || !email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate, email]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await authApi.resetPassword({
        email,
        password: form.password
      });

      localStorage.removeItem("mahi_otp_verified");
      localStorage.removeItem("mahi_verify_email");
      localStorage.removeItem("mahi_verify_type");
      localStorage.removeItem("mahi_debug_otp");

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon="🛡"
      title="Reset Password"
      subtitle="Create a new secure password for your account."
      footer={
        <p className="text-[12px] text-mahi-textMuted2">
          Back to
          <Link
            to="/login"
            className="ml-1 font-bold text-white transition-colors hover:text-mahi-accent"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <form className="w-full space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <label className="theme-label">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="theme-input pr-12"
              placeholder="Enter new password"
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

        <div className="space-y-2.5">
          <label className="theme-label">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="theme-input pr-12"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mahi-textMuted2/60 transition-colors hover:text-mahi-accent"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-[16px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] font-medium text-red-300">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  );
}