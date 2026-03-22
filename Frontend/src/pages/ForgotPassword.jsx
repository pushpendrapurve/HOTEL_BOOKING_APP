import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../assets/assets";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => navigate("/login")} />

      <div className="relative w-[95%] max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-5">
            <img src={assets.logo2} alt="logo" className="h-10 invert opacity-80" />
          </div>

          {success ? (
            <div className="text-center py-2">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Password reset!</h2>
              <p className="text-sm text-gray-500 mb-6">Your password has been updated. You can now sign in.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:opacity-90 transition"
              >
                Go to Sign In →
              </button>
            </div>

          ) : step === 1 ? (
            <>
              <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Forgot your password?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">
                Enter your email and we'll send you a 6-digit OTP.
              </p>
              {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4 text-center border border-red-100">{error}</p>}
              <form onSubmit={handleSendOtp}>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 mb-5"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? "Sending OTP..." : "Send OTP →"}
                </button>
              </form>
            </>

          ) : (
            <>
              <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">Enter OTP</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">
                We sent a 6-digit code to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
              </p>
              {error && <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4 text-center border border-red-100">{error}</p>}

              <form onSubmit={handleReset} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                    />
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? "Resetting..." : "Reset Password →"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }}
                    className="text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </>
          )}

          {!success && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-5">
              Remember your password?{" "}
              <button onClick={() => navigate("/login")} className="text-gray-800 dark:text-gray-200 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
          Secured by <span className="font-semibold">StayHere</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
