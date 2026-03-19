import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../hooks/useAuth";
import apiService from "../API/api_service";
// import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, verify } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      if (response.success) {
        // Supabase returns session data inside the user object from the backend snippet
        const { access_token, refresh_token } = response.user.session;
        login(access_token, refresh_token);
        verify();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/newchat");
        }, 1500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full bg-transparent border-0 border-b border-white/15 pb-3 pt-1
    text-white text-sm font-mono outline-none placeholder-white/15
    transition-all duration-200 focus:border-white
  `;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-6 overflow-hidden relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ghost number */}
      <span
        className="fixed right-0 top-1/2 pointer-events-none select-none"
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: "220px",
          fontWeight: 900,
          color: "rgba(255,255,255,0.03)",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center",
          letterSpacing: "-10px",
          lineHeight: 1,
        }}
      >
        02
      </span>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[9px] tracking-[4px] text-white/25 uppercase font-mono">
              Welcome Back
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <h1
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            className="text-5xl font-black text-white leading-none tracking-tight"
          >
            Sign
            <span className="block text-4xl text-white/20 font-normal italic">
              back in
            </span>
          </h1>
        </div>

        {/* Card */}
        <div className="relative bg-[#0a0a0a] border border-white/10 p-10">
          {/* Corner brackets */}
          <span className="absolute -top-px -left-px w-9 h-9 border-t-2 border-l-2 border-white" />
          <span className="absolute -bottom-px -right-px w-9 h-9 border-b-2 border-r-2 border-white" />

          {/* Error */}
          {error && (
            <div className="mb-7 px-4 py-3 border-l-2 border-white bg-white/[0.04] text-white/70 text-[11px] font-mono tracking-wide">
              ⚠ {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-6">
            <label className="block text-[9px] font-mono tracking-[3px] text-white/30 uppercase mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[9px] font-mono tracking-[3px] text-white/30 uppercase">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[9px] font-mono tracking-[2px] text-white/25 uppercase no-underline border-b border-white/10 pb-px hover:text-white/60 hover:border-white/40 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-8`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success}
            className={`
              group relative w-full py-4 overflow-hidden
              text-[11px] font-mono tracking-[3px] uppercase
              transition-all duration-200 active:scale-[0.99] border-none cursor-pointer
              ${loading || success ? "opacity-50 cursor-not-allowed bg-white text-black" : "bg-white text-black"}
            `}
          >
            {/* Hover fill */}
            <span className="absolute inset-0 bg-black translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {success ? "✓ Signed In" : loading ? "Signing in…" : "Sign In →"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-[10px] font-mono tracking-wider text-white/20">
          <span>No account yet?</span>
          <Link
            to="/signup"
            className="text-white/60 border-b border-white/20 pb-px no-underline hover:text-white hover:border-white transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
