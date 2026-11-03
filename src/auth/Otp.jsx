import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your registered email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input box
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  function handleChange(value, index) {
    // Only accept numeric digit
    if (value && !/^\d+$/.test(value)) return;

    setError('');
    const newOtp = [...otp];
    // If user enters multiple characters (like on mobile autofill)
    const char = value.slice(-1);
    newOtp[index] = char;
    setOtp(newOtp);

    // Focus next box if entered a digit
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back and clear previous
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    setError('');

    // Focus the next empty box or the last box
    const nextEmptyIndex = newOtp.findIndex((val) => val === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  }

  function handleResend() {
    if (!canResend || resending) return;
    setResending(true);
    setResendNotice(false);

    setTimeout(() => {
      setResending(false);
      setCanResend(false);
      setTimer(60);
      setResendNotice(true);
      setTimeout(() => setResendNotice(false), 4000);
    }, 700);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      navigate('/reset-password', {
        state: {
          email: location.state?.email || '',
          verified: true,
        },
      });
    }, 900);
  }

  return (
    <AuthLayout>
      {/* Back button */}
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
        <img src="/Hlogo.png" alt="Mama La Hotel" className="h-12 w-auto object-contain" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-3xl font-bold text-[#15343b]">Verify OTP</h1>
        <div className="p-1.5 bg-[#0bd0c7]/10 text-[#0c6478] rounded-full">
          <ShieldCheck size={22} className="text-[#0bd0c7]" />
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        We sent a 6-digit verification code to{' '}
        <span className="font-semibold text-[#15343b]">{email}</span>. Please enter it below.
      </p>

      {/* Resend notification */}
      {resendNotice && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-lg bg-[#0bd0c7]/10 border border-[#0bd0c7]/40 px-4 py-2.5 text-xs text-[#0c6478]"
        >
          <span>✓</span>
          <span>A new 6-digit code has been sent to your email.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* 6-box OTP input */}
        <div>
          <label className="block text-sm font-medium text-[#15343b] mb-3 text-center sm:text-left">
            Enter 6-Digit Code
          </label>
          <div className="flex justify-between items-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                aria-label={`Digit ${idx + 1}`}
                className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border text-[#15343b] focus:outline-none focus:ring-2 focus:ring-[#0bd0c7] focus:border-transparent transition-all ${
                  error
                    ? 'border-red-400 bg-red-50'
                    : digit
                    ? 'border-[#0c6478] bg-[#0bd0c7]/5'
                    : 'border-gray-300 bg-white'
                }`}
              />
            ))}
          </div>

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-600 text-center sm:text-left">
              {error}
            </p>
          )}
        </div>

        {/* Resend timer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {canResend ? (
              "Didn't receive the code?"
            ) : (
              <>
                Resend code in{' '}
                <span className="font-semibold text-[#0c6478]">
                  {Math.floor(timer / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(timer % 60).toString().padStart(2, '0')}
                </span>
              </>
            )}
          </span>

          {canResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0c6478] hover:text-[#0bd0c7] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Verifying Code…' : 'Verify & Proceed'}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Wrong email address?{' '}
        <Link
          to="/forgot-password"
          className="text-[#0c6478] hover:text-[#0bd0c7] font-semibold transition-colors duration-200"
        >
          Change Email
        </Link>
      </p>
    </AuthLayout>
  );
}

