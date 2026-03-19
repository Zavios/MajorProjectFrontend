import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import api_service from "../API/api_service.js";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
/* ═══════════════════════════════════════════════════════
   Mock reviewed records
   ═══════════════════════════════════════════════════════ */
const MOCK_RECORDS = [
  {
    id: "CXR-20260315-003",
    patientName: "David Kim",
    studyDate: "2026-03-15",
    prediction: "PNEUMONIA",
    confidence: 91.3,
    status: "confirmed",
    doctorNotes:
      "Bilateral opacities consistent with pneumonia. Recommended antibiotics and follow-up imaging in 48 hours.",
    age: "64y",
    sex: "M",
    modality: "CR",
  },
  {
    id: "CXR-20260314-007",
    patientName: "Amira Patel",
    studyDate: "2026-03-14",
    prediction: "NORMAL",
    confidence: 8.2,
    status: "confirmed",
    doctorNotes:
      "Clear lung fields. No consolidation or pleural effusion. Normal cardiomediastinal silhouette.",
    age: "35y",
    sex: "F",
    modality: "CR",
  },
  {
    id: "CXR-20260313-011",
    patientName: "Robert Fischer",
    studyDate: "2026-03-13",
    prediction: "PNEUMONIA",
    confidence: 72.6,
    status: "overridden",
    doctorNotes:
      "Model flagged pneumonia, however opacities appear to be atelectasis rather than infectious consolidation. Overriding to Normal.",
    age: "51y",
    sex: "M",
    modality: "CR",
  },
  {
    id: "CXR-20260312-002",
    patientName: "Sarah Jensen",
    studyDate: "2026-03-12",
    prediction: "PNEUMONIA",
    confidence: 88.9,
    status: "confirmed",
    doctorNotes:
      "Right lower lobe consolidation confirmed. Patient reports cough and fever for 3 days. Started on empiric antibiotics.",
    age: "47y",
    sex: "F",
    modality: "CR",
  },
  {
    id: "CXR-20260311-006",
    patientName: "Thomas Wright",
    studyDate: "2026-03-11",
    prediction: "NORMAL",
    confidence: 5.1,
    status: "confirmed",
    doctorNotes: "Normal chest radiograph. No acute cardiopulmonary process.",
    age: "29y",
    sex: "M",
    modality: "CR",
  },
];

/* ═══════════════════════════════════════════════════════
   DoctorRecordsPage — /doctor/records
   ═══════════════════════════════════════════════════════ */
export default function DoctorRecordsPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [reviewedRecords, setReviewedRecords] = useState([]);

  const selected = reviewedRecords.find((r) => r.id === selectedId);
  const isPositive = (pred) => pred === "PNEUMONIA";

  const getReviewedRecords = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + "/doctor/getapprovedchats",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("doctor_access_token")}`,
          },
        },
      );
      if (response.data.success) {
        console.log("response", response);
        setReviewedRecords(response.data.chats);
      }
    } catch (error) {
      api_service.handleError(error);
    }
  };

  const editDoctorNotes = async () => {
    try {
      const response = await axios.post(
        BACKEND_URL + "/doctor/addnote",
        {
          chat_id: selectedId,
          note: editNotes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("doctor_access_token")}`,
          },
        },
      );
      if (response.data.success) {
        console.log("response", response);
        setReviewedRecords((prev) =>
          prev.map((r) =>
            r.id === selectedId ? { ...r, doctor_note: editNotes } : r
          )
        );
        setIsEditing(false);
      }
    } catch (error) {
      api_service.handleError(error);
    }
  };

  useEffect(() => {
    getReviewedRecords();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans bg-[#fafaf8]">
      {/* ── Header ── */}
      <div className="flex items-center px-6 py-4 border-b border-[#e8e7e4] gap-3.5 sticky top-0 bg-[#fafaf8] z-10">
        <button
          className="flex items-center justify-center w-[34px] h-[34px] border-none bg-transparent
                     rounded-lg cursor-pointer text-[#333] transition-colors duration-150
                     hover:bg-[#f0efec]"
          onClick={() => navigate("/doctor")}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-[17px] font-bold text-[#1a2b3c] m-0 tracking-tight">
            Reviewed Records
          </h1>
          <span className="text-[11px] font-semibold tracking-[0.8px] uppercase text-[#8b9db5]">
            {reviewedRecords.length} cases reviewed
          </span>
        </div>
        <div className="flex-1" />
        <Link
          to="/doctor"
          className="px-[18px] py-[9px] bg-transparent border-[1.5px] border-[#1a2b3c]
                     rounded-lg text-[12.5px] font-semibold text-[#1a2b3c] cursor-pointer
                     no-underline transition-all duration-150
                     hover:bg-[#1a2b3c] hover:text-white"
        >
          Request More Records
        </Link>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── List ── */}
        <div
          className="w-80 min-w-80 border-r border-[#e8e7e4] overflow-y-auto
                     [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#d5d4d0] [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {reviewedRecords.map((record) => (
            <div
              key={record.id}
              className={`flex items-start gap-5 px-[22px] py-4 cursor-pointer border-b border-[#f0efec]
                         transition-colors duration-100
                         hover:bg-[#f5f4f1]
                         ${selectedId === record.id ? "bg-[#eef5ff] border-l-[3px] border-l-blue-500" : ""}`}
              onClick={() => setSelectedId(record.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1a2b3c] mb-[3px]">
                  {record.patientName}
                </div>
                <div className="text-[11px] font-mono text-[#8b9db5] mb-[5px]">
                  {record.id}&ensp;{record.studyDate}
                </div>
                <div
                  className={`text-[11.5px] font-semibold ${
                    isPositive(record.prediction)
                      ? "text-orange-500"
                      : "text-green-500"
                  }`}
                >
                  {record.confidence_score}% ·{" "}
                  {isPositive(record.prediction) ? "Pneumonia" : "Normal"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Detail ── */}
        <div
          className="flex-1 overflow-y-auto
                     [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#d5d4d0] [&::-webkit-scrollbar-thumb]:rounded
                     [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-2.5 text-[#8b9db5]">
              <FileText size={40} className="text-[#c5cdd8]" />
              <p className="text-[13.5px] m-0">
                Select a record to view details
              </p>
            </div>
          ) : (
            <div className="max-w-[560px] mx-auto py-[30px] px-10">
              {/* Patient card */}
              <div className="border border-[#e8e7e4] rounded-xl p-5 mb-4">
                <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] mb-3">
                  Patient
                </p>
                <p className="text-[17px] font-bold text-[#1a2b3c] m-0 mb-0.5">
                  {selected.patientName}
                </p>
                <p className="text-[11px] font-mono text-[#8b9db5] mb-3.5">
                  ID: {selected.id}
                </p>
                <div className="grid grid-cols-3 border-t border-[#e2e1de] pt-3">
                  <div>
                    <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                      Age
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2b3c]">
                      {selected.age}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                      Sex
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2b3c]">
                      {selected.sex}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                      Modality
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2b3c]">
                      {selected.modality}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[9.5px] font-bold tracking-[1px] uppercase text-[#7a8a9e] mb-1">
                    Study Date
                  </div>
                  <div className="text-[15px] font-semibold text-[#1a2b3c]">
                    {selected.studyDate}
                  </div>
                </div>
              </div>

              {/* Model Inference card */}
              <div className="border border-[#e8e7e4] rounded-xl p-5 mb-4">
                <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] mb-3">
                  Model Inference
                </p>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[22px] font-extrabold text-[#1a2b3c]">
                    {isPositive(selected.prediction) ? "Pneumonia" : "Normal"}
                  </span>
                  <span
                    className={`text-[20px] font-bold font-mono ${
                      isPositive(selected.prediction)
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {selected.confidence}%
                  </span>
                </div>
                <div className="flex justify-between text-[9.5px] font-bold tracking-[1px] uppercase mt-3.5 mb-1.5">
                  <span className="text-[#7a8a9e]">Confidence</span>
                  <span
                    className={`font-bold ${
                      isPositive(selected.prediction)
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {isPositive(selected.prediction) ? "POSITIVE" : "NEGATIVE"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#e8e7e4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isPositive(selected.prediction)
                        ? "bg-linear-to-r from-orange-400 to-orange-500"
                        : "bg-linear-to-r from-green-400 to-green-500"
                    }`}
                    style={{ width: `${selected.confidence}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3.5 text-[12.5px] text-[#555]">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isPositive(selected.prediction)
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                  {isPositive(selected.prediction)
                    ? "Pneumonia indicators detected in radiograph"
                    : "No pneumonia indicators detected in radiograph"}
                </div>
              </div>

              {/* Doctor Review card */}
              <div className="border border-[#e8e7e4] rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10.5px] font-bold tracking-[1.2px] uppercase text-[#7a8a9e] m-0">
                    Doctor's Review
                  </p>
                  {!isEditing && (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-[#d5d4d0]
                                 rounded-md text-[11px] font-semibold text-[#555] cursor-pointer
                                 transition-all duration-150
                                 hover:bg-[#f0efec] hover:border-[#bbb] hover:text-[#333]"
                      onClick={() => {
                        setIsEditing(true);
                        setEditNotes(selected.doctor_note || "");
                      }}
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                  )}
                </div>

                <div className="text-xs font-semibold text-[#555] mb-2">
                  Clinical Notes
                </div>
                {isEditing ? (
                  <>
                    <textarea
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg bg-white
                                 text-[13px] text-gray-700 resize-y outline-none font-sans
                                 transition-[border-color] duration-150 box-border
                                 placeholder:text-[#aab5c4]
                                 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Update clinical notes…"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-5 py-2 rounded-lg text-[12.5px] font-semibold cursor-pointer
                                   border-none bg-blue-500 text-white transition-all duration-150
                                   hover:bg-blue-600 hover:shadow-[0_2px_8px_rgba(59,130,246,0.3)]
                                   active:scale-[0.97]"
                        onClick={() => {
                          editDoctorNotes();
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="px-5 py-2 rounded-lg text-[12.5px] font-semibold cursor-pointer
                                   bg-transparent text-[#555] border border-[#d5d4d0]
                                   transition-all duration-150
                                   hover:bg-[#f0efec] hover:border-[#bbb]
                                   active:scale-[0.97]"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-[13.5px] leading-relaxed text-[#444] m-0">
                    {selected.doctor_note}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
