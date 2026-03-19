import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function SetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!age || isNaN(age) || age < 1 || age > 120)
      return setError("Please enter a valid age.");
    if (!gender) return setError("Please select a gender.");

    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
      setTimeout(() => navigate("/newchat"), 2000);
    } catch (err) {
      setError(err.message || "Setup failed. Please try again.");
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
        03
      </span>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[9px] tracking-[4px] text-white/25 uppercase font-mono">
              Step 03 — Profile
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <h1
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            className="text-5xl font-black text-white leading-none tracking-tight"
          >
            Tell us
            <span className="block text-4xl text-white/20 font-normal italic">
              about yourself
            </span>
          </h1>
        </div>

        {/* Progress bar */}
        <div className="mb-8 flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-px flex-1 transition-all duration-500 ${
                s <= 3 ? "bg-white" : "bg-white/15"
              }`}
            />
          ))}
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

          {/* Name */}
          <div className="mb-8">
            <label className="block text-[9px] font-mono tracking-[3px] text-white/30 uppercase mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>

          {/* Age + Gender side by side */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* Age */}
            <div>
              <label className="block text-[9px] font-mono tracking-[3px] text-white/30 uppercase mb-3">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="24"
                min="1"
                max="120"
                className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[9px] font-mono tracking-[3px] text-white/30 uppercase mb-3">
                Gender
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`${inputClass} pr-6 appearance-none cursor-pointer`}
                  style={{ color: gender ? "white" : "rgba(255,255,255,0.15)" }}
                >
                  <option value="" disabled hidden style={{ color: "#000" }}>
                    Select
                  </option>
                  {genders.map((g) => (
                    <option
                      key={g}
                      value={g}
                      style={{ color: "#000", background: "#fff" }}
                    >
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Hint */}
          <p className="text-[9px] font-mono tracking-[1.5px] text-white/15 uppercase mb-8 leading-relaxed">
            This information helps us personalise your experience. <br />
            You can change it anytime in settings.
          </p>

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
            <span className="absolute inset-0 bg-black translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {success ? "✓ All Set" : loading ? "Saving…" : "Continue →"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-[10px] font-mono tracking-wider text-white/20">
          <span>Your data is private & secure.</span>
          <button
            type="button"
            onClick={() => navigate("/newchat")}
            className="text-white/25 border-b border-white/10 pb-px bg-transparent border-none cursor-pointer font-mono text-[10px] tracking-wider hover:text-white/60 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
