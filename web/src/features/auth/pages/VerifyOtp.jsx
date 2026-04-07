import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { authApi } from "../../../api/authApi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(600);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const email = localStorage.getItem("mahi_verify_email");
  const verifyType = localStorage.getItem("mahi_verify_type");

  useEffect(() => {
    if (!email || !verifyType) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, verifyType, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

  function handleChange(value, index) {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      if (verifyType === "register") {
        await authApi.verifyRegisterOtp({
          email,
          code: enteredOtp
        });
        localStorage.removeItem("mahi_verify_email");
        localStorage.removeItem("mahi_verify_type");
        localStorage.removeItem("mahi_debug_otp");
        navigate("/login", { replace: true });
      } else {
        await authApi.verifyForgotOtp({
          email,
          code: enteredOtp
        });
        localStorage.setItem("mahi_otp_verified", "true");
        navigate("/reset-password", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setError("");
      setOtp(["", "", "", "", "", ""]);
      setSeconds(600);

      let res;

      if (verifyType === "register") {
        setError("For register flow, go back and submit register again to resend.");
        return;
      } else {
        res = await authApi.forgotPassword({ email });
      }

      if (res?.data?.data?.otpPreview) {
        localStorage.setItem("mahi_debug_otp", res.data.data.otpPreview);
      }

      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to resend OTP");
    }
  }

  return (
    <AuthCard
      icon="🔒"
      title="Verify OTP"
      subtitle={`Enter the 6-digit code sent to ${email || "your email"}.`}
      footer={
        <div className="flex flex-col items-center gap-5">
          <div className="text-center">
            <span className="text-[12px] uppercase tracking-[0.18em] text-mahi-textMuted2">
              Didn&apos;t receive the code?
            </span>
            <button
              type="button"
              onClick={handleResend}
              className="ml-2 text-[12px] font-bold text-mahi-accent underline underline-offset-4 transition-colors hover:text-mahi-accent/80"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Resend Code
            </button>
          </div>

          <div
            className="text-[10px] uppercase tracking-[0.25em] text-mahi-textMuted2/80"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Expires in {formattedTime}
          </div>

          {localStorage.getItem("mahi_debug_otp") ? (
            <div className="text-[11px] text-mahi-accent">
              Dev OTP: {localStorage.getItem("mahi_debug_otp")}
            </div>
          ) : null}

          <Link
            to="/login"
            className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-mahi-accent"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            ← Back to Login
          </Link>
        </div>
      }
    >
      <form className="w-full space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-14 w-full rounded-lg border border-white/5 bg-[#1a1a1a]/50 text-center text-lg font-bold text-white outline-none transition-all placeholder:text-white/20 focus:border-mahi-accent/50 focus:ring-1 focus:ring-mahi-accent/50"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              placeholder="•"
            />
          ))}
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
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthCard>
  );
}