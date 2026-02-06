import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginRegisterModal = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const handleClose = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and Password are required.");
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Full Name is required.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      // ✅ Store Token + User in LocalStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // fallback if backend is not sending user
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: formData.name || "User",
            email: formData.email,
          })
        );
      }

      setMessage(data.message || "Success!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);

      // ✅ Redirect immediately
      navigate("/");

      // ✅ Navbar refresh (temporary solution)
      window.location.reload();
    } catch (err) {
      setError("Server error! Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div className="relative w-[95%] max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute right-3 top-3 rounded-lg border border-gray-300 p-1 hover:bg-gray-100 transition"
          onClick={handleClose}
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            {isLogin ? "Sign in to QuickStay" : "Create your account"}
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1">
            {isLogin
              ? "Welcome back! Please sign in to continue"
              : "Join QuickStay and start booking hotels easily"}
          </p>

          {/* Google Button UI */}
          <button
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          {/* OR Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-3 text-center">
              {error}
            </p>
          )}

          {/* Success Message */}
          {message && (
            <p className="bg-green-100 text-green-700 text-sm p-2 rounded-lg mb-3 text-center">
              {message}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            {!isLogin && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Pushpendra Purve"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pushpendra@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-2 rounded-lg font-medium text-sm transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:opacity-90"
              }`}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Continue →"
                : "Register →"}
            </button>
          </form>

          {/* Switch */}
          <p className="text-sm text-gray-500 text-center mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-gray-800 font-semibold hover:underline"
              onClick={() => navigate(isLogin ? "/register" : "/login")}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-3 text-center text-xs text-gray-500">
          Secured by <span className="font-semibold">QuickStay</span>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterModal;
