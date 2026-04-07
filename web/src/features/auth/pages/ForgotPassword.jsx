import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { authApi } from "../../../api/authApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await authApi.forgotPassword({
        email: email.trim().toLowerCase()
      });

      localStorage.setItem("mahi_verify_email", email.trim().toLowerCase());
      localStorage.setItem("mahi_verify_type", "forgot");

      if (res?.data?.data?.otpPreview) {
        localStorage.setItem("mahi_debug_otp", res.data.data.otpPreview);
      }

      navigate("/verify-otp", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon="✉"
      title="Forgot Password"
      subtitle="Enter your email address and we will send you a verification code."
      footer={
        <p className="text-[12px] text-mahi-textMuted2">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 font-bold text-white transition-colors hover:text-mahi-accent"
          >
            Back to Login
          </Link>
        </p>
      }
    >
      <form className="w-full space-y-7" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <label className="theme-label">Email Address</label>
          <input
            type="email"
            className="theme-input"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </AuthCard>
  );
}