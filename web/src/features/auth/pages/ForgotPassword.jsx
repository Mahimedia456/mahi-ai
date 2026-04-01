import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    localStorage.setItem("mahi_reset_email", email);
    localStorage.setItem("mahi_reset_otp", "123456");

    navigate("/verify-otp", { replace: true });
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

        <button
          type="submit"
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest"
        >
          Send Code
        </button>
      </form>
    </AuthCard>
  );
}