"use client";

import React from "react";
import { Files, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

import type { ActiveTab, FileTabsProps } from "@/types";

export type { ActiveTab, FileTabsProps };

export function FileTabs({
  activeTab,
  onTabChange,
  trashCount = 0,
  onEmptyTrash,
}: FileTabsProps) {
  const tabs = [
    { id: "all" as const, label: "All Files", icon: Files },
    { id: "starred" as const, label: "Starred", icon: Star },
    { id: "trash" as const, label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : tab.id === "starred"
                      ? "text-amber-500"
                      : tab.id === "trash"
                        ? "text-rose-500"
                        : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "trash" && trashCount > 0 && onEmptyTrash && (
        <Button
          variant="danger"
          size="sm"
          onClick={onEmptyTrash}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Empty Trash ({trashCount})
        </Button>
      )}
    </div>
  );
}
