"use client";

import React from "react";
import { ChevronRight, Home, Folder } from "lucide-react";

import type { BreadcrumbItem, FolderNavigationProps } from "@/types";

export type { BreadcrumbItem, FolderNavigationProps };

export function FolderNavigation({
  breadcrumbs,
  onNavigate,
}: FolderNavigationProps) {
  return (
    <nav
      className="flex items-center flex-wrap gap-1.5 text-sm py-2"
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;

        return (
          <div key={crumb.id || "root"} className="flex items-center gap-1.5">
            {idx > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            )}

            <button
              onClick={() => onNavigate(crumb.id)}
              disabled={isLast}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition font-medium ${
                isLast
                  ? "text-slate-900 dark:text-slate-100 font-semibold cursor-default bg-slate-100 dark:bg-slate-800/80"
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
            </button>
          </div>
        );
      })}
    </nav>
  );
}
