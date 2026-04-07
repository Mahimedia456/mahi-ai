import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { authApi } from "../../../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setError("Please accept Terms and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await authApi.register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      localStorage.setItem("mahi_verify_email", form.email.trim().toLowerCase());
      localStorage.setItem("mahi_verify_type", "register");

      if (res?.data?.data?.otpPreview) {
        localStorage.setItem("mahi_debug_otp", res.data.data.otpPreview);
      }

      navigate("/verify-otp", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      icon="✨"
      title="Create Account"
      subtitle="Join Mahi AI and start creating with intelligence."
      footer={
        <p className="text-[12px] text-mahi-textMuted2">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-bold text-white transition-colors hover:text-mahi-accent"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <label className="theme-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="theme-input"
            placeholder="Alex Rivera"
            required
          />
        </div>

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
              placeholder="Create a secure password"
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
              placeholder="Confirm your password"
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

        <label className="flex items-start gap-3 pt-1 text-[12px] text-mahi-textMuted2">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border border-mahi-outlineVariant bg-transparent accent-[#53f5e7]"
            required
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-bold text-white transition-colors hover:text-mahi-accent">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-bold text-white transition-colors hover:text-mahi-accent">
              Privacy Policy
            </a>
          </span>
        </label>

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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
}