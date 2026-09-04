"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { FileIcon } from "@/components/ui/FileIcon";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import {
  formatFileSize,
  formatRelativeTime,
  getFileCategory,
} from "@/lib/utils";
import { FileRecord } from "@/lib/db/schema";

import type { FilePreviewModalProps } from "@/types";

export type { FilePreviewModalProps };

export function FilePreviewModal({
  file,
  isOpen,
  onClose,
}: FilePreviewModalProps) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  const category = file ? getFileCategory(file.type, file.isFolder) : "other";

  useEffect(() => {
    if (isOpen && file && file.fileUrl && category === "code") {
      setLoadingText(true);
      fetch(file.fileUrl)
        .then((res) => (res.ok ? res.text() : "Unable to load text preview."))
        .then((txt) => {
          // Truncate if gigantic
          setTextContent(
            txt.length > 50000
              ? txt.slice(0, 50000) + "\n\n...[Preview truncated]"
              : txt,
          );
        })
        .catch(() => setTextContent("Error loading preview."))
        .finally(() => setLoadingText(false));
    } else {
      setTextContent(null);
    }
  }, [isOpen, file, category]);

  if (!file) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={file.name}
      maxWidth={category === "image" || category === "pdf" ? "4xl" : "2xl"}
    >
      <div className="space-y-4">
        {/* Metadata info bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <FileIcon type={file.type} isFolder={file.isFolder} size="sm" />
            <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase">
              {file.type || "FILE"}
            </span>
            <span>•</span>
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>Uploaded {formatRelativeTime(file.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            {file.fileUrl && (
              <>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={file.fileUrl}
                  download={file.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Dynamic preview content */}
        <div className="flex items-center justify-center min-h-[220px] max-h-[70vh] overflow-auto rounded-xl bg-slate-100 dark:bg-slate-950 p-2 border border-slate-200 dark:border-slate-800">
          {category === "image" && file.fileUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.fileUrl}
              alt={file.name}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
            />
          )}

          {category === "pdf" && file.fileUrl && (
            <iframe
              src={file.fileUrl}
              title={file.name}
              className="w-full h-[65vh] rounded-lg border-0"
            />
          )}

          {category === "video" && file.fileUrl && (
            <video
              src={file.fileUrl}
              controls
              className="max-h-[60vh] max-w-full rounded-lg shadow"
            >
              Your browser does not support video playback.
            </video>
          )}

          {category === "audio" && file.fileUrl && (
            <div className="flex flex-col items-center gap-4 py-8 px-4 w-full max-w-md">
              <FileIcon type={file.type} isFolder={false} size="xl" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {file.name}
              </p>
              <audio src={file.fileUrl} controls className="w-full">
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {category === "code" && (
            <div className="w-full h-full max-h-[60vh] overflow-auto">
              {loadingText ? (
                <div className="flex items-center justify-center p-12 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading source text...</span>
                </div>
              ) : (
                <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                  {textContent || "No text preview available."}
                </pre>
              )}
            </div>
          )}

          {category !== "image" &&
            category !== "pdf" &&
            category !== "video" &&
            category !== "audio" &&
            category !== "code" && (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <FileIcon type={file.type} isFolder={file.isFolder} size="xl" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    {file.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct visual preview not supported for this file format.
                  </p>
                </div>
                {file.fileUrl && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(file.fileUrl!, "_blank")}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Download File
                  </Button>
                )}
              </div>
            )}
        </div>
      </div>
    </Modal>
  );
}
