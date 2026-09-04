"use client";

import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
  onUploadSuccess: () => void;
}
import type { FileUploadModalProps, UploadTask } from "@/types";

interface UploadTask {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
}
export type { FileUploadModalProps, UploadTask };

export function FileUploadModal({
  isOpen,
  onClose,
  parentId,
  onUploadSuccess,
}: FileUploadModalProps) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newTasks: UploadTask[] = Array.from(fileList).map((file) => ({
      file,
      status: "pending",
      progress: 0,
    }));
    setTasks((prev) => [...prev, ...newTasks]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (task: UploadTask, index: number) => {
    try {
      setTasks((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, status: "uploading", progress: 10 } : t,
        ),
      );

      // 1. Get ImageKit client auth tokens
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to get upload authorization");
      }
      const authData = await authRes.json();

      setTasks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, progress: 30 } : t)),
      );

      // 2. Direct upload to ImageKit CDN
      const formData = new FormData();
      formData.append("file", task.file);
      formData.append("fileName", task.file.name);
      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      );
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("folder", "/droply");

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to upload to ImageKit CDN");
      }

      const uploadResult = await uploadRes.json();

      setTasks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, progress: 75 } : t)),
      );

      // 3. Save file metadata in Droply database
      const saveRes = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: task.file.name,
          size: task.file.size,
          type: task.file.type || "application/octet-stream",
          fileUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl || null,
          imagekitFileId: uploadResult.fileId || null,
          parentId: parentId || null,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Uploaded to storage, but failed to save file record");
      }

      setTasks((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, status: "success", progress: 100 } : t,
        ),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setTasks((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, status: "error", errorMessage: msg } : t,
        ),
      );
    }
  };

  const startUpload = async () => {
    setIsUploadingAll(true);
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].status === "pending" || tasks[i].status === "error") {
        await uploadFile(tasks[i], i);
      }
    }
    setIsUploadingAll(false);
    addToast("Files uploaded successfully!", "success");
    onUploadSuccess();
  };

  const handleClose = () => {
    if (isUploadingAll) return;
    setTasks([]);
    onClose();
  };

  const hasPending = tasks.some(
    (t) => t.status === "pending" || t.status === "error",
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Files"
      description="Upload files directly to Droply cloud storage via ImageKit CDN."
      maxWidth="lg"
      showCloseButton={!isUploadingAll}
    >
      <div className="space-y-4">
        {/* Drag and drop target */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-900/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFilesAdded(e.target.files)}
          />
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center">
            Click to browse or drag and drop files here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports images, PDFs, videos, documents, audio, and archives
          </p>
        </div>

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden mr-2">
                  {task.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                  )}
                  {task.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {task.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  {task.status === "pending" && (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}

                  <div className="truncate">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {task.file.name}
                    </p>
                    <p className="text-slate-400">
                      {formatFileSize(task.file.size)}
                    </p>
                    {task.errorMessage && (
                      <p className="text-rose-500 text-[11px] mt-0.5">
                        {task.errorMessage}
                      </p>
                    )}
                  </div>
                </div>

                {task.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(idx);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploadingAll}
          >
            {hasPending ? "Cancel" : "Done"}
          </Button>

          {hasPending && (
            <Button
              variant="primary"
              onClick={startUpload}
              isLoading={isUploadingAll}
              leftIcon={<UploadCloud className="w-4 h-4" />}
            >
              Upload {tasks.length} {tasks.length === 1 ? "File" : "Files"}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
