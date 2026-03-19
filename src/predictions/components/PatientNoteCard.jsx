import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

/* ── Patient Note Card ── */
export default function PatientNoteCard() {
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNote = () => {
    if (note.trim()) {
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
        PATIENT NOTE
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add any symptoms or context for the doctor..."
        rows={3}
        className="w-full rounded-xl border border-gray-200 bg-gray-50/70 p-3.5
                   text-sm text-gray-700 resize-none outline-none
                   focus:border-blue-300 focus:ring-2 focus:ring-blue-100
                   transition-all placeholder:text-gray-400"
      />
      <button
        onClick={handleSaveNote}
        className={`
          w-full mt-3 py-3 rounded-xl text-sm font-semibold
          transition-all duration-200 cursor-pointer border-none
          ${
            noteSaved
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]"
          }
        `}
      >
        {noteSaved ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Saved!
          </span>
        ) : (
          "Save Note"
        )}
      </button>
    </div>
  );
}
