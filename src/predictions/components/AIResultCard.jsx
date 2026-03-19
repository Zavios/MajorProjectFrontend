import React from "react";

/* ── Confidence Bar ── */
function ConfidenceBar({ value, status }) {
  const color =
    status === "POSITIVE"
      ? "bg-gradient-to-r from-orange-400 to-orange-500"
      : "bg-gradient-to-r from-green-400 to-green-500";

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs font-semibold tracking-wider mb-1.5">
        <span className="text-gray-500">CONFIDENCE</span>
        <span
          className={
            status === "POSITIVE" ? "text-orange-500" : "text-green-500"
          }
        >
          {status}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ── AI Model Result Card ── */
export default function AIResultCard({ result }) {
  return (
    <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-6">
      <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
        AI MODEL RESULT
      </p>
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-2xl font-bold text-gray-900">
          {result.prediction == "NORMAL" ? "Not Pneumonia" : "Pneumonia"}
        </h3>
        <span className="text-2xl font-mono font-bold text-orange-500">
          {result.confidence}%
        </span>
      </div>
      <ConfidenceBar
        value={result.confidence}
        status={result.prediction == "NORMAL" ? "NEGATIVE" : "POSITIVE"}
      />
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
        {result.prediction == "NORMAL"
          ? "No Pneumonia indicators detected in X-ray"
          : "Pneumonia indicators detected in X-ray"}
      </div>
    </div>
  );
}
