import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { registerApi } from "../api/endpoints";
import toast from "react-hot-toast";

function validate(fields) {
  const errors = {};
  if (!fields.userName?.trim()) {
    errors.userName = "Full name is required.";
  }
  if (!fields.email?.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export default function Register() {
  const [fields, setFields] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Register submit triggered:", fields);

    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userName: fields.userName,
        fullName: fields.userName,
        email: fields.email,
        password: fields.password,
        phoneNumber: fields.phoneNumber || undefined,
      };
      console.log("Sending registration request:", payload);

      const res = await registerApi(payload);
      console.log("Registration response:", res);

      const successMsg =
        res.data?.message || res.message || "Account created successfully!";
      toast.success(successMsg);
      navigate("/verify-otp", { state: { email: fields.email } });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Logo */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img
          src="/Hlogo.png"
          alt="Mama La Hotel"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-[#15343b] mb-1">
        Create an Account
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Join us and experience luxury at Mama La Hotel.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        {/* Full name */}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-[#15343b] mb-1.5"
          >
            Full Name
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            autoComplete="name"
            value={fields.userName}
            onChange={handleChange}
            aria-invalid={!!errors.userName}
            aria-describedby={errors.userName ? "userName-error" : undefined}
            placeholder="John Doe"
            className={`w-full border rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
              errors.userName ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.userName && (
            <p
              id="userName-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.userName}
            </p>
          )}
        </div>

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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-[#15343b] mb-1.5"
          >
            Phone Number{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            value={fields.phoneNumber}
            onChange={handleChange}
            placeholder="+234 000 000 0000"
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
              autoComplete="new-password"
              value={fields.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              placeholder="Min. 8 characters"
              className={`w-full border rounded-lg px-4 py-2.5 pr-11 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c6478] focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
            >
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200 mt-1"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0c6478] hover:text-[#0bd0c7] font-semibold transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
