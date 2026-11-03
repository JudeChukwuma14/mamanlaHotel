import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

function validate(fields) {
  const errors = {};
  if (!fields.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!fields.terms) errors.terms = 'You must accept the terms & conditions.';
  return errors;
}

export default function Register() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log('Sign up:', { fullName: fields.fullName, email: fields.email, phone: fields.phone });
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <AuthLayout>
      {/* Logo */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img src="/Hlogo.png" alt="Mama La Hotel" className="h-10 w-auto object-contain" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-[#15343b] mb-1">Create an Account</h1>
      <p className="text-gray-500 text-sm mb-6">Join us and experience luxury at Mama La Hotel.</p>

      {/* Backend banner */}
      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 flex items-start gap-3 rounded-lg bg-[#0bd0c7]/10 border border-[#0bd0c7]/40 px-4 py-3 text-sm text-[#0c6478]"
        >
          <span className="mt-0.5 shrink-0">ℹ️</span>
          <span>
            <strong>Backend not connected.</strong> Your details were logged to the console. No data
            was sent.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#15343b] mb-1.5">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fields.fullName}
            onChange={handleChange}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            placeholder="John Doe"
            className={`w-full border rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
              errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#15343b] mb-1.5">
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
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#15343b] mb-1.5">
            Phone Number{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={handleChange}
            placeholder="+234 000 000 0000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] transition"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#15343b] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={fields.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              placeholder="Min. 8 characters"
              className={`w-full border rounded-lg px-4 py-2.5 pr-11 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c6478] focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
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
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
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
