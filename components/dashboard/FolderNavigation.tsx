"use client";

import React, { useState } from "react";
import { ChevronRight, Home, Folder } from "lucide-react";

import type { BreadcrumbItem, FolderNavigationProps } from "@/types";

export type { BreadcrumbItem, FolderNavigationProps };

export function FolderNavigation({
  breadcrumbs,
  onNavigate,
  onMoveItems,
  onDropFilesOnBreadcrumb,
}: FolderNavigationProps) {
  const [hoveredCrumbId, setHoveredCrumbId] = useState<string | null | undefined>(
    undefined,
  );

  return (
    <nav
      className="flex items-center flex-wrap gap-1.5 text-sm py-2"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isHovered = hoveredCrumbId === crumb.id && !isLast;

        return (
          <div key={crumb.id || "root"} className="flex items-center gap-1.5">
            {idx > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            )}

            <button
              onClick={() => onNavigate(crumb.id)}
              disabled={isLast}
              onDragOver={(e) => {
                if (!isLast) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setHoveredCrumbId(crumb.id);
                }
              }}
              onDragLeave={() => {
                if (!isLast) {
                  setHoveredCrumbId(undefined);
                }
              }}
              onDrop={(e) => {
                if (isLast) return;
                e.preventDefault();
                setHoveredCrumbId(undefined);

                // 1. External files dropped from OS
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  onDropFilesOnBreadcrumb?.(
                    Array.from(e.dataTransfer.files),
                    crumb.id,
                    crumb.name,
                  );
                  return;
                }

                // 2. Internal Droply items dragged
                try {
                  const dataStr = e.dataTransfer.getData("application/json");
                  if (dataStr) {
                    const parsed = JSON.parse(dataStr);
                    if (
                      parsed.type === "droply-item" &&
                      Array.isArray(parsed.ids) &&
                      parsed.ids.length > 0
                    ) {
                      onMoveItems?.(parsed.ids, crumb.id, crumb.name);
                    }
                  }
                } catch {
                  // ignore JSON parse errors
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition font-medium ${
                isLast
                  ? "text-slate-900 dark:text-slate-100 font-semibold cursor-default bg-slate-100 dark:bg-slate-800/80"
                  : isHovered
                    ? "bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-500 font-bold text-blue-600 dark:text-blue-400 scale-105"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer"
              }`}
            >
              {idx === 0 ? (
                <Home className="w-4 h-4 shrink-0 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 shrink-0 text-amber-500" />
              )}
              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                {crumb.name}
              </span>
              {isHovered && (
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded ml-1 animate-pulse">
                  Drop
                </span>
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
