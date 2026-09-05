"use client";

import React from "react";
import { FolderOpen, Star, Trash2, Search, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { EmptyStateProps } from "@/types";

export type { EmptyStateProps };

export function EmptyState({
  tab,
  isSearch = false,
  onUploadClick,
  onCreateFolderClick,
}: EmptyStateProps) {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No matching files found
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Try adjusting your search query or look in another folder.
        </p>
      </div>
    );
  }

  if (tab === "starred") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 mb-3">
          <Star className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No starred files yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Click the star icon next to any critical file or folder to easily
          access it here.
        </p>
      </div>
    );
  }

  if (tab === "trash") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 mb-3">
          <Trash2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Trash is empty
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Deleted files and folders will appear here for safe recovery before
          permanent purge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        <FolderOpen className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        This folder is empty
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
        Upload documents, images, videos or create subfolders to keep your
        workspace organized.
      </p>

      <div className="flex items-center gap-3 mt-6">
        {onUploadClick && (
          <Button
            variant="primary"
            size="md"
            onClick={onUploadClick}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Upload Files
          </Button>
        )}
        {onCreateFolderClick && (
          <Button variant="outline" size="md" onClick={onCreateFolderClick}>
            Create Folder
          </Button>
        )}
      </div>
    </div>
  );
}
