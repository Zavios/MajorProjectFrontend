import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, ClipboardList } from "lucide-react";
import ApiService from "../API/api_service";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
/* ═══════════════════════════════════════════════════════
   Mock data — replace with real API calls later
   ═══════════════════════════════════════════════════════ */
const MOCK_CASES = [
  {
    id: "CXR-20260317-001",
    patientName: "James Harlow",
    age: "58y",
    sex: "M",
    modality: "CR",
    studyDate: "2026-03-17",
    imageUrl:
      "https://prod-images-static.radiopaedia.org/images/34839897/5e4d41c349685c589e77ee991f0d85_big_gallery.jpeg",
    prediction: "PNEUMONIA",
    confidence: 84.2,
  },
  {
    id: "CXR-20260316-005",
    patientName: "Elena Vasquez",
    age: "42y",
    sex: "F",
    modality: "CR",
    studyDate: "2026-03-16",
    imageUrl:
      "https://prod-images-static.radiopaedia.org/images/545212/332009ee4dae282f6ace657e91bc33_big_gallery.jpg",
    prediction: "NORMAL",
    confidence: 12.8,
  },
  {
    id: "CXR-20260316-009",
    patientName: "Marcus Chen",
    age: "71y",
    sex: "M",
    modality: "CR",
    studyDate: "2026-03-16",
    imageUrl:
      "https://prod-images-static.radiopaedia.org/images/1371188/2cd5f86e0fc4b5d0a8c2c3e5d8b6f4_big_gallery.jpg",
    prediction: "PNEUMONIA",
    confidence: 91.5,
  },
];

let _mockIdx = 0;

/* ═══════════════════════════════════════════════════════
   DoctorPage — /doctor
   ═══════════════════════════════════════════════════════ */
export default function DoctorPage() {
  const navigate = useNavigate();
  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState(null);

  const getNextCase = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        BACKEND_URL + "/doctor/requestrecord",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("doctor_access_token")}`,
          },
        },
      );
      if (response.data.success) {
        console.log("response", response);
        setCurrentCase(response.data.chats[0]);
        setNotes("");
        setLoading(false);
      }
    } catch (error) {
      ApiService.handleError(error);
      setLoading(false);
    }
  };

  const addNote = async () => {
    setLoading(true);
    try {
      console.log(localStorage.getItem("doctor_access_token"));
      const response = await axios.post(
        BACKEND_URL + "/doctor/addnote",
        {
          chat_id: currentCase.id,
          note: notes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("doctor_access_token")}`,
          },
        },
      );
      console.log("response not", response);
      if (response.data.success) {
        console.log("response not", response);
        setCurrentCase(response.data.chat);
        setNotes("");
        setLoading(false);
        // window.location.reload();
      }
    } catch (error) {
      ApiService.handleError(error);
      setLoading(false);
    }
  };

  const requestNextCase = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const nextCase = MOCK_CASES[_mockIdx % MOCK_CASES.length];
    _mockIdx++;
    setCurrentCase(nextCase);
    setNotes("");
    setLoading(false);
  };

  const submitVerdict = (type) => {
    const label =
      type === "confirm" ? "Diagnosis Confirmed" : "Diagnosis Overridden";
    setToast({ type, label });
    setTimeout(() => setToast(null), 2500);
    setCurrentCase(null);
    setNotes("");
  };

  const isPositive = currentCase?.prediction === "PNEUMONIA";

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* ── Left Panel ── */}
      <div className="flex-1 bg-[#111113] flex items-center justify-center relative overflow-hidden">
        {!currentCase ? (
          <div className="flex flex-col items-center gap-1.5 text-center px-8">
            <div className="w-[72px] h-[72px] rounded-2xl bg-white/6 flex items-center justify-center mb-3">
              <FileText size={32} className="text-white/25" />
            </div>
            <h2 className="text-white/70 text-base font-medium m-0 tracking-tight">
              No case loaded
            </h2>
            <p className="text-white/30 text-[12.5px] leading-relaxed max-w-[280px] m-0">
              Request the next undiagnosed X-ray from the queue to begin your
              review.
            </p>
            <button
              className={`mt-5 px-7 py-[11px] bg-blue-500 text-white border-none rounded-[10px]
                         text-[13.5px] font-semibold cursor-pointer tracking-[0.01em]
                         transition-all duration-150
                         hover:bg-blue-600 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(59,130,246,0.35)]
                         active:scale-[0.97]
                         ${loading ? "opacity-70 pointer-events-none" : ""}`}
              onClick={getNextCase}
              disabled={loading}
            >
              {loading ? "Loading…" : "Request Next Case"}
            </button>
          </div>
        ) : (
          <>
            <img
              key={currentCase.id}
              src={currentCase.image_url}
              alt="Chest X-ray"
              className="w-full h-full object-contain animate-[fadeInUp_0.4s_ease]"
            />
            <span className="absolute bottom-4 left-4 text-white/50 text-lg font-bold tracking-[2px]">
              L
            </span>
          </>
        )}
      </div>

      {/* ── Right Sidebar ── */}
      <div
        className="w-80 min-w-80 bg-[#fafaf8] border-l border-[#e8e7e4] flex flex-col overflow-y-auto
                      [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#d5d4d0] [&::-webkit-scrollbar-thumb]:rounded
                      [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e7e4] sticky top-0 bg-[#fafaf8] z-10">
          <span className="text-[15px] font-bold text-[#1a3a5c] tracking-tight italic">
            Diagnostic Workbench
          </span>
          <Link
            to="/doctor/records"
            className="flex items-center gap-[5px] px-3 py-1.5 bg-transparent border border-[#d5d4d0]
                       rounded-md text-[11px] font-semibold text-[#555] tracking-[0.6px] uppercase
                       no-underline transition-all duration-150
                       hover:bg-[#f0efec] hover:border-[#bbb] hover:text-[#333]"
          >
            <ClipboardList size={13} />
            Records
          </Link>
        </div>

        {/* Body */}
        <div className="flex-1">
          {!currentCase ? (
            <div className="flex items-center justify-center h-[200px] text-[#8b9db5] text-[13.5px] italic">
              Request a case to begin reviewing.
            </div>
          ) : (
            <>
              {/* ── Patient Card ── */}
              <div className="px-5 py-5 border-b border-[#e8e7e4] animate-[fadeInUp_0.35s_ease_forwards]">
                <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] mb-3">
                  Patient
                </p>
                <p className="text-[17px] font-bold text-[#1a2b3c] m-0 mb-0.5">
                  {currentCase.patientName}
                </p>
                <p className="text-[11px] font-mono text-[#8b9db5] mb-3.5">
                  ID: {currentCase.id}
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-[#e2e1de] pt-3">
                  <div>
                    <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                      Age
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2b3c]">
                      {currentCase.age}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                      Sex
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2b3c]">
                      {currentCase.gender}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                    Study Date
                  </div>
                  <div className="text-[15px] font-semibold text-[#1a2b3c]">
                    {currentCase.studyDate}
                  </div>
                </div>
              </div>

              {/* ── Model Inference Card ── */}
              <div className="px-5 py-5 border-b border-[#e8e7e4] animate-[fadeInUp_0.35s_ease_forwards] [animation-delay:0.07s]">
                <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] mb-3">
                  Model Inference
                </p>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[22px] font-extrabold text-[#1a2b3c]">
                    {isPositive ? "Pneumonia" : "Normal"}
                  </span>
                  <span
                    className={`text-[20px] font-bold font-mono ${isPositive ? "text-orange-500" : "text-green-500"}`}
                  >
                    {currentCase.confidence}%
                  </span>
                </div>
                <div className="flex justify-between text-[9.5px] font-bold tracking-[1px] uppercase mt-3.5 mb-1.5">
                  <span className="text-[#7a8a9e]">Confidence</span>
                  <span
                    className={`font-bold ${isPositive ? "text-orange-500" : "text-green-500"}`}
                  >
                    {isPositive ? "POSITIVE" : "NEGATIVE"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e8e7e4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isPositive
                        ? "bg-linear-to-r from-orange-400 to-orange-500"
                        : "bg-linear-to-r from-green-400 to-green-500"
                    }`}
                    style={{ width: `${currentCase.confidence}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3.5 text-[12.5px] text-[#555]">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${isPositive ? "bg-orange-500" : "bg-green-500"}`}
                  />
                  {isPositive
                    ? "Pneumonia indicators detected in radiograph"
                    : "No pneumonia indicators detected in radiograph"}
                </div>
              </div>

              {/* ── Doctor's Verdict Card ── */}
              <div className="px-5 py-5 border-b border-[#e8e7e4] animate-[fadeInUp_0.35s_ease_forwards] [animation-delay:0.14s]">
                <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] mb-3">
                  Doctor's Verdict
                </p>
                <div className="text-xs font-semibold text-[#555] mb-2">
                  Clinical Notes
                </div>
                <textarea
                  className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg bg-white
                             text-[13px] text-gray-700 resize-y outline-none font-sans
                             transition-[border-color] duration-150 box-border
                             placeholder:text-[#aab5c4]
                             focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
                  placeholder="Describe findings…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex gap-2 mt-3.5">
                  <button
                    className="w-full py-2.5 rounded-lg text-[12.5px] font-semibold cursor-pointer
                               border-none bg-blue-500 text-white transition-all duration-150
                               hover:bg-blue-600 hover:shadow-[0_2px_8px_rgba(59,130,246,0.3)]
                               active:scale-[0.97]"
                    onClick={() => addNote()}
                  >
                    Submit Note
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-7 py-3 rounded-[10px]
                      text-[13.5px] font-semibold text-white z-999 pointer-events-none
                      animate-[toastIn_0.3s_ease_forwards]
                      ${
                        toast.type === "confirm"
                          ? "bg-[#1a8754] shadow-[0_4px_18px_rgba(34,197,94,0.3)]"
                          : "bg-[#d97706] shadow-[0_4px_18px_rgba(249,115,22,0.3)]"
                      }`}
        >
          {toast.label}
        </div>
      )}
    </div>
  );
}
