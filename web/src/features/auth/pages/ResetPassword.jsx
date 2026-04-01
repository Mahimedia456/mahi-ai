import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem("mahi_otp_verified") === "true";
    if (!isVerified) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.removeItem("mahi_reset_otp");
    localStorage.removeItem("mahi_otp_verified");
    localStorage.removeItem("mahi_reset_email");

    navigate("/login", { replace: true });
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

        <button
          type="submit"
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest"
        >
          Reset Password
        </button>
      </form>
    </AuthCard>
  );
}