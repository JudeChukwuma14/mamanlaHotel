import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";


export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fields.email.trim()) {
      toast.error("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!fields.password) {
      toast.error("Password is required.");
      return;
    }
    if (fields.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

  
  }

  return (
    <AuthLayout>
      {/* Logo */}
      <div className="mb-8 flex justify-center md:justify-start">
        <img
          src="/Hlogo.png"
          alt="Mama La Hotel"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-[#15343b] mb-1">Welcome Back</h1>
      <p className="text-gray-500 text-sm mb-8">
        Sign in to your account to continue your journey.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#15343b] mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] transition"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#15343b] mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={fields.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c6478] focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="flex items-center gap-2 text-sm text-[#15343b] cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              checked={fields.remember}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#0c6478] accent-[#0c6478] focus:ring-[#0bd0c7]"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-[#0c6478] hover:text-[#0bd0c7] font-medium transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-[#0c6478] hover:text-[#0bd0c7] font-semibold transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
