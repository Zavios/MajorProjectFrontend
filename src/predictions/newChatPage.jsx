import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileImage, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Reads token lazily so it's always fresh (not stale at module load time)
const uploadXray = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file); // must match upload.single("image") on the backend

    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${BACKEND_URL}/chat/upload-xray`,
      formData,
      {
        headers: {
          // Let the browser set  Content-Type with boundary automatically for multipart
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response);

    // axios wraps the response body in response.data, so check response.data.success
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to upload X-ray");
    }

    return response.data; // { success, message, data: [chatRecord] }
  } catch (error) {
    console.error("Error uploading X-ray:", error);
    throw error;
  }
};

/* ── Mock analysis (swap with real API later) ── */
function simulateAnalysis() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        diagnosis: "Pneumonia",
        confidence: 8.5,
        status: "NEGETIVE",
        description: "Pneumonia indicators detected in radiograph",
      });
    }, 2000);
  });
}

/* ── Generate a unique ID ── */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── Upload Zone ── */
function UploadZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  return (
    <div className="flex items-center justify-center w-full min-h-[70vh] p-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center
          w-full max-w-2xl py-20 px-10 rounded-2xl cursor-pointer
          border-2 border-dashed transition-all duration-300 ease-in-out
          ${
            dragOver
              ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-lg shadow-blue-100"
              : "border-gray-300 bg-gray-50/60 hover:border-blue-400 hover:bg-blue-50/40"
          }
        `}
      >
        {/* Icon */}
        <div
          className={`
          flex items-center justify-center w-14 h-14 rounded-xl mb-5
          transition-all duration-300
          ${dragOver ? "bg-blue-100 text-blue-600" : "bg-white text-gray-400 shadow-sm"}
        `}
        >
          <Upload size={26} strokeWidth={1.8} />
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1.5">
          Upload Chest X-Ray
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
          Drag and drop a chest radiograph image, or click to browse.
          <br />
          Supports JPEG, PNG, and DICOM formats.
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium
                     shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95
                     transition-all duration-150 cursor-pointer"
        >
          Select File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/dicom,.dcm"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
      </div>
    </div>
  );
}

/* ── Loading Overlay ── */
function AnalyzingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] gap-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
          <Loader2 size={36} className="text-blue-500 animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
          <FileImage size={14} className="text-blue-400" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">Analyzing X-Ray…</p>
        <p className="text-sm text-gray-500 mt-1">
          Our AI model is processing your radiograph
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ██  NewChatPage — Upload at /newchat  ██
   ══════════════════════════════════════════ */
export default function NewChatPage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileSelect = useCallback(
    async (file) => {
      setAnalyzing(true);

      try {
        // Call the real upload API
        const { data: chatRecords } = await uploadXray(file);
        const chatRecord = chatRecords?.[0] ?? {};

        // Use the ID returned by the backend as the page key
        const id = chatRecord.id || chatRecord.xray_id || chatRecord.chat_id || generateId();
        const imageUrl = chatRecord.image_url || URL.createObjectURL(file);

        // Store result so the prediction page can retrieve it
        sessionStorage.setItem(
          `prediction_${id}`,
          JSON.stringify({
            result: chatRecord,
            imageUrl,
            imageName: file.name,
          }),
        );

        // Navigate to the results page
        navigate(`/prediction/${id}`);
      } catch {
        setAnalyzing(false);
      }
    },
    [navigate],
  );

  return (
    <div className="w-full h-full flex flex-col items-center">
      {analyzing ? (
        <AnalyzingOverlay />
      ) : (
        <UploadZone onFileSelect={handleFileSelect} />
      )}
    </div>
  );
}
