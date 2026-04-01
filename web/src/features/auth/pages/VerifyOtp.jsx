import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(114);
  const inputsRef = useRef([]);

  useEffect(() => {
    const email = localStorage.getItem("mahi_reset_email");
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

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

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const enteredOtp = otp.join("");
    const savedOtp = localStorage.getItem("mahi_reset_otp");

    if (enteredOtp.length !== 6) {
      alert("Please enter the full 6-digit OTP.");
      return;
    }

    if (enteredOtp !== savedOtp) {
      alert("Invalid OTP. Use 123456 for this demo flow.");
      return;
    }

    localStorage.setItem("mahi_otp_verified", "true");
    navigate("/reset-password", { replace: true });
  }

  function handleResend() {
    localStorage.setItem("mahi_reset_otp", "123456");
    setOtp(["", "", "", "", "", ""]);
    setSeconds(114);
    inputsRef.current[0]?.focus();
  }

  return (
    <AuthCard
      icon="🔒"
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email."
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

        <button
          type="submit"
          className="theme-btn-primary w-full py-4 text-sm font-extrabold uppercase tracking-widest"
        >
          Verify
        </button>
      </form>
    </AuthCard>
  );
}