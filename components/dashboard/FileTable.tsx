"use client";

import React from "react";
import { FileIcon } from "@/components/ui/FileIcon";
import { Star, Trash2, RotateCcw, Download, Eye } from "lucide-react";
import { formatFileSize, formatRelativeTime } from "@/lib/utils";

import type { FileTableProps } from "@/types";

export type { FileTableProps };

export function FileTable({
  items,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onFolderClick,
  onFileClick,
  onToggleStar,
  onToggleTrash,
  onPermanentDelete,
  activeTab,
}: FileTableProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3.5 pl-4 pr-2 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAllToggle}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                aria-label="Select all files"
              />
            </th>
            <th className="py-3.5 px-3">Name</th>
            <th className="py-3.5 px-3 hidden sm:table-cell w-32">Size</th>
            <th className="py-3.5 px-3 hidden md:table-cell w-36">Modified</th>
            <th className="py-3.5 pr-4 pl-3 text-right w-36">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <tr
                key={item.id}
                className={`group transition-colors duration-150 ${
                  isSelected
                    ? "bg-blue-50/70 dark:bg-blue-950/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Select Checkbox */}
                <td className="py-3.5 pl-4 pr-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectToggle(item.id)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    aria-label={`Select ${item.name}`}
                  />
                </td>

                {/* Name & Context Icon */}
                <td className="py-3.5 px-3">
                  <div
                    onClick={() => {
                      if (item.isFolder) {
                        onFolderClick(item.id);
                      } else {
                        onFileClick(item);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  >
                    <FileIcon
                      type={item.type}
                      isFolder={item.isFolder}
                      size="md"
                    />
                    <div className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </p>
                      {item.isFolder ? (
                        <span className="text-[11px] text-slate-400">
                          Folder
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 sm:hidden">
                          {formatFileSize(item.size)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Size */}
                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 hidden sm:table-cell text-xs">
                  {item.isFolder ? "—" : formatFileSize(item.size)}
                </td>

                {/* Modified / Upload Date */}
                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 hidden md:table-cell text-xs">
                  {formatRelativeTime(item.updatedAt || item.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 pr-4 pl-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Star toggle */}
                    {activeTab !== "trash" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(item.id);
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          item.isStarred
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-slate-400 hover:text-amber-500 opacity-70 group-hover:opacity-100"
                        }`}
                        title={item.isStarred ? "Unstar" : "Star"}
                        aria-label="Star toggle"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.isStarred ? "fill-amber-500" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* Preview / View icon */}
                    {!item.isFolder && item.fileUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileClick(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-70 group-hover:opacity-100 transition"
                        title="Preview"
                        aria-label="Preview file"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Download button */}
                    {!item.isFolder && item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        download={item.name}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-70 group-hover:opacity-100 transition"
                        title="Download"
                        aria-label="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}

                    {/* Trash or Restore button */}
                    {activeTab !== "trash" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTrash(item.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 opacity-70 group-hover:opacity-100 transition"
                        title="Move to Trash"
                        aria-label="Trash item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTrash(item.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition"
                          title="Restore"
                          aria-label="Restore item"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPermanentDelete(item);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                          title="Delete Permanently"
                          aria-label="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
