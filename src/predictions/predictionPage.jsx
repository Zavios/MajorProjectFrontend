import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Pencil, Check, X } from "lucide-react";
import ApiService from "../API/api_service";

import AIResultCard from "./components/AIResultCard";
import DoctorReviewCard from "./components/DoctorReviewCard";
import PatientNoteCard from "./components/PatientNoteCard";

/* ══════════════════════════════════════════════════════
   ██  PredictionPage — Results at /prediction/:id  ██
   ══════════════════════════════════════════════════════ */
export default function PredictionPage() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  const getPrediction = async () => {
    try {
      const response = await ApiService.get(`/chat/getchat/${id}`);
      if (response.success) {
        console.log("response chat", response.chat);
        setData(response.chat);
        const chatTitle = response.chat?.title || "Untitled Prediction";
        setTitle(chatTitle);
        setTitleDraft(chatTitle);
      }
    } catch (error) {
      ApiService.handleError(error);
    }
  };

  const saveTitle = async () => {
    if (!titleDraft.trim() || titleDraft === title) {
      setEditingTitle(false);
      return;
    }
    setSavingTitle(true);
    try {
      await ApiService.post(`/chat/edit-title`, {
        title: titleDraft.trim(),
        chat_id: id,
      });
      setTitle(titleDraft.trim());
      setEditingTitle(false);
    } catch (error) {
      ApiService.handleError(error);
    } finally {
      setSavingTitle(false);
    }
  };

  useEffect(() => {
    getPrediction();
  }, [id]);

  /* No data found */
  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500">
        <AlertCircle size={48} className="text-gray-300" />
        <p className="text-lg font-medium">Prediction not found</p>
        <button
          onClick={() => navigate("/newchat")}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium
                     hover:bg-blue-700 transition-colors cursor-pointer border-none"
        >
          Upload New X-Ray
        </button>
      </div>
    );
  }

  const result = {
    prediction: data.prediction,
    confidence: data.confidence_score,
  };
  const imageUrl = data.image_url;
  const review = {
    review:
      data.doctor_note ||
      "A radiologist will review the AI findings and provide their clinical assessment. You will be notified when the review is complete.",
    status: data.is_approved ? "Approved" : "Awaiting Review",
  };

  // const { result, imageUrl } = data;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full py-4 px-4">
        {/* ── Title ── */}
        <div className="flex items-center gap-3 mb-6">
          {editingTitle ? (
            <>
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(title);
                    setEditingTitle(false);
                  }
                }}
                className="flex-1 text-2xl font-bold text-gray-900 border-b-2 border-blue-500
                           outline-none bg-transparent pb-0.5"
              />
              <button
                onClick={saveTitle}
                disabled={savingTitle}
                title="Save title"
                className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700
                           transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => {
                  setTitleDraft(title);
                  setEditingTitle(false);
                }}
                title="Cancel"
                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200
                           transition-colors cursor-pointer border-none"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              <button
                onClick={() => setEditingTitle(true)}
                title="Edit title"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50
                           transition-colors cursor-pointer bg-transparent border-none"
              >
                <Pencil size={15} />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* ── Left: Image ── */}
          <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg h-full">
            <img
              src={imageUrl}
              alt="Uploaded chest X-ray"
              className="w-full h-full object-contain"
            />
          </div>

          {/* ── Right: Cards ── */}
          <div className="flex flex-col gap-5 overflow-y-auto">
            <AIResultCard result={result} />
            <DoctorReviewCard review={review} />
            <PatientNoteCard />
          </div>
        </div>
      </div>
    </div>
  );
}
