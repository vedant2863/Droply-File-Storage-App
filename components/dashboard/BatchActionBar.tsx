"use client";

import React from "react";
import { Download, Star, StarOff, Trash2, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { BatchActionBarProps } from "@/types";

export type { BatchActionBarProps };

export function BatchActionBar({
  selectedCount,
  activeTab,
  onDeselectAll,
  onDownloadZip,
  onBatchStar,
  onBatchTrash,
  onBatchDelete,
  isDownloadingZip = false,
  isLoading = false,
}: BatchActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-4 z-30 mb-4 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-xl shadow-blue-500/5 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>

        <button
          onClick={onDeselectAll}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
        >
          <X className="w-3.5 h-3.5" />
          <span>Deselect all</span>
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Download ZIP */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onDownloadZip}
          isLoading={isDownloadingZip}
          leftIcon={<Download className="w-4 h-4 text-blue-500" />}
        >
          Download ZIP
        </Button>

        {activeTab !== "trash" ? (
          <>
            {/* Star / Unstar */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchStar(true)}
              disabled={isLoading}
              leftIcon={<Star className="w-4 h-4 text-amber-500" />}
            >
              Star
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchStar(false)}
              disabled={isLoading}
              leftIcon={<StarOff className="w-4 h-4 text-slate-400" />}
            >
              Unstar
            </Button>

            {/* Move to Trash */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchTrash(true)}
              disabled={isLoading}
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
            >
              Trash
            </Button>
          </>
        ) : (
          <>
            {/* Restore */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBatchTrash(false)}
              disabled={isLoading}
              leftIcon={<RotateCcw className="w-4 h-4 text-emerald-500" />}
            >
              Restore
            </Button>

            {/* Permanent delete */}
            <Button
              variant="danger"
              size="sm"
              onClick={onBatchDelete}
              disabled={isLoading}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Permanently
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
