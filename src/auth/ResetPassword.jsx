import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";


export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [fields, setFields] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!fields.otp.trim() || fields.otp.trim().length < 6) {
      toast.error("Please enter the 6-digit code sent to your email.");
      return;
    }
    if (!fields.newPassword) {
      toast.error("New password is required.");
      return;
    }
    if (fields.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (!fields.confirmPassword) {
      toast.error("Please confirm your new password.");
      return;
    }
    if (fields.confirmPassword !== fields.newPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

  
  }

  // Guard: if no email in state, push back to forgot-password
  if (!email) {
    return (
      <AuthLayout>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">
            Session expired. Please start over.
          </p>
          <Link
            to="/forgot-password"
            className="text-[#0c6478] font-semibold hover:text-[#0bd0c7]"
          >
            Forgot Password
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {/* Back */}
      <div className="mb-6">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0c6478] transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Logo */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img
          src="/Hlogo.png"
          alt="Mama La Hotel"
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-3xl font-bold text-[#15343b]">Reset Password</h1>
        <div className="p-1.5 bg-[#0bd0c7]/10 rounded-full">
          <Lock size={20} className="text-[#0bd0c7]" />
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Enter the code sent to{" "}
        <strong className="text-[#15343b]">{email}</strong> and your new
        password.
      </p>

      {success ? (
        <div className="bg-white border border-[#0bd0c7]/40 rounded-xl p-6 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#0bd0c7]/20 flex items-center justify-center mb-4">
            <CheckCircle2 size={30} className="text-[#0c6478]" />
          </div>
          <h2 className="text-xl font-bold text-[#15343b] mb-2">
            Password Reset Complete!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-[#0c6478] hover:bg-[#0a536a] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
          >
            Sign In to Your Account
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* OTP code */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-[#15343b] mb-1.5"
            >
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={fields.otp}
              onChange={handleChange}
              placeholder="e.g. 748291"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center tracking-widest font-bold text-lg text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] transition"
            />
          </div>

          {/* New password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#15343b] mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={fields.newPassword}
                onChange={handleChange}
                placeholder="Min. 8 characters"
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

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#15343b] mb-1.5"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={fields.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={
                  showConfirm
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c6478] focus:outline-none"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password hints */}
          <div className="bg-[#0bd0c7]/5 border border-[#0bd0c7]/20 rounded-lg p-3 text-xs text-[#0c6478]">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li
                className={
                  fields.newPassword.length >= 8
                    ? "text-[#0c6478] font-medium"
                    : ""
                }
              >
                At least 8 characters long
              </li>
              <li
                className={
                  /\d/.test(fields.newPassword)
                    ? "text-[#0c6478] font-medium"
                    : ""
                }
              >
                Contains at least one number
              </li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200 mt-1"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Resetting Password…" : "Reset Password"}
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-[#0c6478] hover:text-[#0bd0c7] font-semibold transition-colors duration-200"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
