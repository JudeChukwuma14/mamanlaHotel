import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

function validate(fields) {
  const errors = {};
  if (!fields.password) {
    errors.password = 'New password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(fields.password)) {
    errors.password = 'Password should contain letters and at least one number.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    // Simulate updating password in backend
    setTimeout(() => {
      console.log('Password successfully reset');
      setLoading(false);
      setSuccess(true);
    }, 800);
  }

  return (
    <AuthLayout>
      {/* Back to sign in */}
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
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-3xl font-bold text-[#15343b]">Reset Password</h1>
        <div className="p-1.5 bg-[#0bd0c7]/10 text-[#0c6478] rounded-full">
          <Lock size={20} className="text-[#0bd0c7]" />
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Create a new, strong password to protect your account.
      </p>

      {success ? (
        <div className="bg-white border border-[#0bd0c7]/40 rounded-xl p-6 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#0bd0c7]/20 flex items-center justify-center mb-4 text-[#0c6478]">
            <CheckCircle2 size={30} className="text-[#0c6478]" />
          </div>
          <h2 className="text-xl font-bold text-[#15343b] mb-2">Password Reset Complete!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been successfully updated. You can now use your new password to sign into Mama La Hotel.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-[#0c6478] hover:bg-[#0a536a] text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
          >
            Sign In to Your Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* New password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#15343b] mb-1.5">
              New Password
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

          {/* Confirm new password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#15343b] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={fields.confirmPassword}
                onChange={handleChange}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                placeholder="Re-enter your new password"
                className={`w-full border rounded-lg px-4 py-2.5 pr-11 text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c6478] focus:outline-none"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password hints */}
          <div className="bg-[#0bd0c7]/5 border border-[#0bd0c7]/20 rounded-lg p-3 text-xs text-[#0c6478]">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li className={fields.password.length >= 8 ? 'text-[#0c6478] font-medium' : ''}>
                At least 8 characters long
              </li>
              <li className={/\d/.test(fields.password) ? 'text-[#0c6478] font-medium' : ''}>
                Contains at least one number
              </li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200 mt-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Resetting Password…' : 'Reset Password'}
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
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

