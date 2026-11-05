import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { resendOtpApi, verifyEmailApi } from "../api/endpoints";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  function handleChange(value, index) {
    if (value && !/^\d+$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => v === "");
    inputRefs.current[nextEmpty !== -1 ? nextEmpty : 5]?.focus();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailApi({ email, otp: code });
      const successMgs = res.data?.message || "Email verified successfully";
      toast.success(successMgs);
      navigate("/login", { state: { isVerified: true } });
    } catch (error) {
      const res = error.response?.data;
      const message = res.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);

    try {
      const res = await resendOtpApi({ email });
      toast(res.data?.message);
    } catch (error) {
      const res = error.response.data;
      toast.error(res?.message);
    } finally {
      setResending(false);
      setCanResend(false);
      setCooldown(60);
    }
  };

  // If landed here without an email
  if (!email) {
    return (
      <AuthLayout>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No email address provided.</p>
          <Link
            to="/register"
            className="text-[#0c6478] font-semibold hover:text-[#0bd0c7]"
          >
            Go to Register
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
          to="/register"
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
        <h1 className="text-3xl font-bold text-[#15343b]">Verify Your Email</h1>
        <div className="p-1.5 bg-[#0bd0c7]/10 rounded-full">
          <ShieldCheck size={22} className="text-[#0bd0c7]" />
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-[#15343b]">{email}</span>. Enter it
        below to verify your account.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* 6-box OTP input */}
        <div>
          <label className="block text-sm font-medium text-[#15343b] mb-3 text-center sm:text-left">
            Enter 6-Digit Code
          </label>
          <div
            className="flex justify-between items-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
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
                  digit
                    ? "border-[#0c6478] bg-[#0bd0c7]/5"
                    : "border-gray-300 bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resend timer */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {canResend ? (
              "Didn't receive the code?"
            ) : (
              <>
                Resend code in{" "}
                <span className="font-semibold text-[#0c6478]">
                  {Math.floor(cooldown / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(cooldown % 60).toString().padStart(2, "0")}
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
              <RefreshCw
                size={14}
                className={resending ? "animate-spin" : ""}
              />
              {resending ? "Sending…" : "Resend Code"}
            </button>
          )}
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0c6478] hover:bg-[#0a536a] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2.5 font-semibold transition-colors duration-200"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Verifying…" : "Verify & Continue"}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Wrong email?{" "}
        <Link
          to="/register"
          className="text-[#0c6478] hover:text-[#0bd0c7] font-semibold transition-colors duration-200"
        >
          Go back & change
        </Link>
      </p>
    </AuthLayout>
  );
}
