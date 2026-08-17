"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, FileType, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadDataset } from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FloatingUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      // Delay reset slightly for exit animation
      const timer = setTimeout(() => {
        setSelectedFile(null);
        setUploading(false);
        setMessage("");
        setStatus("idle");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    const allowedExtensions = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedExtensions.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setMessage("Please upload a CSV or Excel file.");
      setStatus("error");
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setMessage("");
      setStatus("idle");

      const response = await uploadDataset(selectedFile);
      
      setMessage(response.message || "Dataset uploaded successfully!");
      setStatus("success");
      
      setTimeout(() => {
        setIsOpen(false);
        router.push("/chat");
      }, 1500);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.detail || "Network error. Please try again.");
      } else {
        setMessage("An unexpected error occurred.");
      }
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 items-center justify-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/90 px-4 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl transition-colors hover:bg-slate-800 md:px-6"
      >
        <UploadCloud size={24} className={isHovered ? "animate-pulse" : ""} />
        <span className="hidden font-bold tracking-tight md:block">Upload Dataset</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl sm:rounded-3xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-6 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Bring your data into Charex</h2>
                  <p className="mt-1 text-sm text-slate-400">Upload a dataset to instantly generate charts and insights.</p>
                </div>
                <button
                  onClick={() => !uploading && setIsOpen(false)}
                  disabled={uploading}
                  className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!selectedFile ? (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={{
                      borderColor: isDragging ? "rgba(6, 182, 212, 0.5)" : "rgba(255, 255, 255, 0.1)",
                      backgroundColor: isDragging ? "rgba(6, 182, 212, 0.05)" : "rgba(255, 255, 255, 0.02)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      handleFileSelect(file);
                    }}
                    className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 shadow-inner transition-transform group-hover:-translate-y-1">
                      <UploadCloud size={32} />
                    </div>

                    <h3 className="text-lg font-bold text-white text-center">
                      {isDragging ? "Release to upload" : "Drop your dataset here"}
                    </h3>
                    
                    {!isDragging && (
                      <>
                        <div className="my-4 flex items-center gap-3 w-48">
                          <div className="h-px w-full bg-white/10" />
                          <span className="text-xs text-slate-500 font-medium">or</span>
                          <div className="h-px w-full bg-white/10" />
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                          Browse files
                        </button>

                        <p className="mt-4 text-xs font-medium text-slate-500 flex items-center gap-1">
                          <FileType size={14} /> CSV • XLSX
                        </p>
                      </>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 font-bold uppercase text-sm">
                        {selectedFile.name.split('.').pop()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      {!uploading && status !== "success" && (
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="Remove file"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleUpload}
                        disabled={uploading || status === "success"}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-400 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                          </>
                        ) : status === "success" ? (
                          <>
                            <CheckCircle2 size={18} />
                            Success!
                          </>
                        ) : (
                          "Upload Dataset"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Status Messages */}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium ${
                      status === "success" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {status === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
