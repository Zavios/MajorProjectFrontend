import React from "react";
import { Clock } from "lucide-react";

/* ── Doctor's Review Card ── */
export default function DoctorReviewCard({ review }) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
      <p className="text-xs font-bold tracking-widest text-gray-500 mb-3">
        DOCTOR'S REVIEW
      </p>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-blue-400">
          <Clock size={22} />
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-[15px]">
            {/* Awaiting Review */}
            {review.status}
          </p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {/* A radiologist will review the AI findings and provide their clinical assessment. You will be notified when the review is complete. */}
            {review.review}
          </p>
        </div>
      </div>
    </div>
  );
}
