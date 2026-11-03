import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

function validate(fields) {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      console.log('Forgot password request for:', fields.email);
      setLoading(false);
      setSent(true);
    }, 800);
  }

  function handleProceedToOtp() {
    navigate('/otp', { state: { email: fields.email } });
  }

  return (
    <AuthLayout>
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0c6478] transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>

      {/* Logo */}
      <div className="mb-6 flex justify-center md:justify-start">
        <img src="/Hlogo.png" alt="Mama La Hotel" className="h-12 w-auto object-contain" />
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-[#15343b] mb-1">Forgot Password?</h1>
      <p className="text-gray-500 text-sm mb-6">
        Don&apos;t worry! Enter your registered email address and we&apos;ll send you a 6-digit OTP code to reset your password.
      </p>

      {sent ? (
        <div className="bg-white border border-[#0bd0c7]/40 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-3 text-[#0c6478]">
            <CheckCircle2 size={24} className="text-[#0bd0c7]" />
            <h2 className="font-semibold text-base">OTP Code Sent!</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            We have sent a 6-digit verification code to{' '}
            <strong className="text-[#15343b]">{fields.email}</strong>. Please check your inbox or spam folder.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleProceedToOtp}
              className="flex-1 bg-[#0c6478] hover:bg-[#0a536a] text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors text-center"
            >
              Enter OTP Code
            </button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="border border-gray-300 hover:bg-gray-50 text-[#15343b] py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
            >
              Change Email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#15343b] mb-1.5">
              Email Address
            </label>
            <div className="relative">
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
                className={`w-full border rounded-lg px-4 py-2.5 pr-10 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Sending code…' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {/* Footer links */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Remember your password?{' '}
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

