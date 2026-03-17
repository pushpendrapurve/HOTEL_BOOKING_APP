import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        setSent(true);
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

      <div className="relative w-[95%] max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8">
          <div className="flex justify-center mb-4">
            <img src={assets.logo2} alt="logo" className="h-12 invert opacity-80" />
          </div>

          {!sent ? (
            <>
              <h2 className="text-xl font-semibold text-center text-gray-800">Forgot your password?</h2>
              <p className="text-sm text-gray-500 text-center mt-1 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <p className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4 text-center border border-red-100">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 mb-5"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500 mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-medium text-gray-800 mb-6">{email}</p>
              <p className="text-xs text-gray-400 mb-6">
                The link expires in 15 minutes. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-sm text-primary hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center mt-6">
            Remember your password?{" "}
            <button onClick={() => navigate("/login")} className="text-gray-800 font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>

        <div className="bg-gray-50 py-3 text-center text-xs text-gray-500">
          Secured by <span className="font-semibold">QuickStay</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
