"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UploadBox from "@/components/upload/UploadBox";
import { uploadDataset } from "@/lib/auth";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setMessage("");

      const response = await uploadDataset(selectedFile);

      setMessage(response.message);
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white">
            Upload Dataset
          </h1>

          <p className="mt-2 text-slate-400">
            Upload a CSV or Excel dataset for AI-powered analysis.
          </p>
        </div>

        {/* Upload Box */}
        <UploadBox onFileSelect={setSelectedFile} />

        {/* Selected File */}
        {selectedFile && (
          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold text-cyan-400">
              Selected File
            </h2>

            <p className="text-white">
              <strong>Name:</strong> {selectedFile.name}
            </p>

            <p className="mt-2 text-white">
              <strong>Size:</strong>{" "}
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>

            <p className="mt-2 text-white">
              <strong>Type:</strong> {selectedFile.type}
            </p>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Dataset"}
            </button>

            {message && (
              <p
                className={`mt-4 ${
                  message.toLowerCase().includes("success")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}