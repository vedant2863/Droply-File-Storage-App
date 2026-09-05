"use client";

import React, { useState } from "react";
import { FileIcon } from "@/components/ui/FileIcon";
import { Star, Trash2, RotateCcw, Download, Eye, CornerDownRight } from "lucide-react";
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
  onMoveItems,
  onDropFilesOnFolder,
}: FileTableProps) {
  const [draggedItemIds, setDraggedItemIds] = useState<string[]>([]);
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (activeTab === "trash") return;

    // If the dragged item is part of the current selection, move all selected items.
    // Otherwise, move just this item.
    const targetIds = selectedIds.includes(itemId) ? selectedIds : [itemId];
    setDraggedItemIds(targetIds);

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "droply-item", ids: targetIds }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItemIds([]);
    setHoveredFolderId(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, folderId: string) => {
    // Cannot drop into one of the items currently being dragged
    if (draggedItemIds.includes(folderId)) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoveredFolderId !== folderId) {
      setHoveredFolderId(folderId);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent, folderId: string) => {
    if (hoveredFolderId === folderId) {
      setHoveredFolderId(null);
    }
  };

  const handleFolderDrop = (
    e: React.DragEvent,
    folderId: string,
    folderName: string,
  ) => {
    e.preventDefault();
    setHoveredFolderId(null);

    // 1. Check if files were dropped from the operating system (desktop / file explorer)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFilesOnFolder?.(
        Array.from(e.dataTransfer.files),
        folderId,
        folderName,
      );
      return;
    }

    // 2. Check if internal Droply items were dragged
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (
          parsed.type === "droply-item" &&
          Array.isArray(parsed.ids) &&
          parsed.ids.length > 0
        ) {
          // Filter out the destination folder itself
          const validIds = parsed.ids.filter((id: string) => id !== folderId);
          if (validIds.length > 0) {
            onMoveItems?.(validIds, folderId, folderName);
          }
        }
      }
    } catch {
      // ignore parsing errors
    }
  };

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
            const isBeingDragged = draggedItemIds.includes(item.id);
            const isDropTarget = hoveredFolderId === item.id;

            return (
              <tr
                key={item.id}
                draggable={activeTab !== "trash"}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={
                  item.isFolder
                    ? (e) => handleFolderDragOver(e, item.id)
                    : undefined
                }
                onDragLeave={
                  item.isFolder
                    ? (e) => handleFolderDragLeave(e, item.id)
                    : undefined
                }
                onDrop={
                  item.isFolder
                    ? (e) => handleFolderDrop(e, item.id, item.name)
                    : undefined
                }
                className={`group transition-all duration-150 ${
                  isBeingDragged
                    ? "opacity-40 bg-slate-100 dark:bg-slate-800 border-dashed border-2 border-blue-400"
                    : isDropTarget
                      ? "bg-blue-100/90 dark:bg-blue-950/70 ring-2 ring-blue-500 ring-inset shadow-md"
                      : isSelected
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
                    <div
                      className={`transition-transform duration-150 ${
                        isDropTarget ? "scale-125" : ""
                      }`}
                    >
                      <FileIcon
                        type={item.type}
                        isFolder={item.isFolder}
                        size="md"
                      />
                    </div>
                    <div className="truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.name}
                        </p>
                        {isDropTarget && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold animate-pulse shrink-0">
                            <CornerDownRight className="w-3 h-3" />
                            Drop inside
                          </span>
                        )}
                      </div>
                      {item.isFolder ? (
                        <span className="text-[11px] text-slate-400">
                          Folder {activeTab !== "trash" && "• Drag files here"}
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
