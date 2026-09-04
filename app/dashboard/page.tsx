"use client";

import React, { useState, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { Navbar } from "@/components/layout/Navbar";
import {
  FolderNavigation,
  BreadcrumbItem,
} from "@/components/dashboard/FolderNavigation";
import { FileTabs, ActiveTab } from "@/components/dashboard/FileTabs";
import { BatchActionBar } from "@/components/dashboard/BatchActionBar";
import { FileTable } from "@/components/dashboard/FileTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FileUploadModal } from "@/components/dashboard/FileUploadModal";
import { CreateFolderModal } from "@/components/dashboard/CreateFolderModal";
import { FilePreviewModal } from "@/components/dashboard/FilePreviewModal";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Button } from "@/components/ui/Button";
import { UploadCloud, FolderPlus, Loader2 } from "lucide-react";
import { FileRecord } from "@/lib/db/schema";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { authFetch } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "Home" },
  ]);
  const [items, setItems] = useState<FileRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [trashCount, setTrashCount] = useState(0);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch files from API
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("tab", activeTab);
      if (activeTab === "all" && currentParentId) {
        params.set("parentId", currentParentId);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await authFetch(`/api/files?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        if (activeTab === "all" && data.breadcrumbs) {
          setBreadcrumbs(data.breadcrumbs);
        }
      }
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentParentId, searchQuery, authFetch]);

  // Fetch trash count for tab badge
  const fetchTrashCount = useCallback(async () => {
    try {
      const res = await authFetch("/api/files?tab=trash");
      if (res.ok) {
        const data = await res.json();
        setTrashCount(data.items?.length || 0);
      }
    } catch {
      // ignore
    }
  }, [authFetch]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    fetchTrashCount();
  }, [fetchTrashCount]);

  // Clear selection on tab change or folder navigation
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedIds([]);
  };

  const handleNavigate = (folderId: string | null) => {
    setCurrentParentId(folderId);
    setSelectedIds([]);
  };

  // Selection toggle
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  // Star toggle
  const handleToggleStar = async (fileId: string) => {
    try {
      const res = await authFetch(`/api/files/${fileId}/star`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((item) =>
            item.id === fileId
              ? { ...item, isStarred: data.file.isStarred }
              : item,
          ),
        );
        addToast(
          data.file.isStarred ? "Added to Starred" : "Removed from Starred",
          "info",
        );
      }
    } catch {
      addToast("Failed to update star state", "error");
    }
  };

  // Soft Delete / Restore
  const handleToggleTrash = async (fileId: string) => {
    try {
      const res = await authFetch(`/api/files/${fileId}/trash`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        addToast(
          data.isTrash ? "Moved to Trash" : "Restored from Trash",
          "success",
        );
        fetchFiles();
        fetchTrashCount();
      }
    } catch {
      addToast("Failed to update trash state", "error");
    }
  };

  // Permanent Delete Single Item
  const handlePermanentDelete = (item: FileRecord) => {
    setConfirmModal({
      isOpen: true,
      title: `Permanently delete "${item.name}"?`,
      message: item.isFolder
        ? "This will permanently erase this folder and all its contents from Droply and cloud storage. This action cannot be undone."
        : "This will permanently erase this file from Droply and cloud storage. This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/files/${item.id}/delete`, {
            method: "DELETE",
          });
          if (res.ok) {
            addToast(`Permanently deleted "${item.name}"`, "success");
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            fetchFiles();
            fetchTrashCount();
          } else {
            addToast("Failed to permanently delete item", "error");
          }
        } catch {
          addToast("Network error deleting item", "error");
        }
      },
    });
  };

  // Batch Operations
  const handleBatchStar = async (star: boolean) => {
    try {
      const res = await authFetch("/api/files/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: star ? "star" : "unstar",
          fileIds: selectedIds,
        }),
      });

      if (res.ok) {
        addToast(
          star ? "Selected items starred" : "Selected items unstarred",
          "success",
        );
        setSelectedIds([]);
        fetchFiles();
      }
    } catch {
      addToast("Failed to update items", "error");
    }
  };

  const handleBatchTrash = async (trash: boolean) => {
    try {
      const res = await authFetch("/api/files/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: trash ? "trash" : "restore",
          fileIds: selectedIds,
        }),
      });

      if (res.ok) {
        addToast(
          trash ? "Moved selected items to Trash" : "Restored selected items",
          "success",
        );
        setSelectedIds([]);
        fetchFiles();
        fetchTrashCount();
      }
    } catch {
      addToast("Batch trash operation failed", "error");
    }
  };

  const handleBatchDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: `Delete ${selectedIds.length} items permanently?`,
      message:
        "All selected files and folders (including all nested subfolders) will be erased permanently from cloud storage. This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await authFetch("/api/files/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "delete",
              fileIds: selectedIds,
            }),
          });

          if (res.ok) {
            addToast("Permanently deleted selected items", "success");
            setSelectedIds([]);
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            fetchFiles();
            fetchTrashCount();
          } else {
            addToast("Failed to delete items", "error");
          }
        } catch {
          addToast("Network error during batch deletion", "error");
        }
      },
    });
  };

  // Empty Trash
  const handleEmptyTrash = () => {
    setConfirmModal({
      isOpen: true,
      title: "Empty Entire Trash?",
      message:
        "This will permanently erase all files and folders in your trash from database and ImageKit cloud storage. This action cannot be reversed.",
      onConfirm: async () => {
        try {
          const res = await authFetch("/api/files/empty-trash", {
            method: "DELETE",
          });
          if (res.ok) {
            addToast("Trash emptied successfully", "success");
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            fetchFiles();
            fetchTrashCount();
          } else {
            addToast("Failed to empty trash", "error");
          }
        } catch {
          addToast("Network error emptying trash", "error");
        }
      },
    });
  };

  // Hierarchical ZIP Download
  const handleDownloadZip = async () => {
    if (selectedIds.length === 0) return;

    setIsDownloadingZip(true);
    addToast("Preparing files for ZIP archive...", "info");

    try {
      // 1. Get manifest with nested directory structure
      const manifestRes = await authFetch("/api/files/download-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds: selectedIds }),
      });

      if (!manifestRes.ok) {
        throw new Error("Failed to prepare download tree");
      }

      const { files: manifestFiles } = await manifestRes.json();

      if (!manifestFiles || manifestFiles.length === 0) {
        addToast("No downloadable files found in selection", "warning");
        setIsDownloadingZip(false);
        return;
      }

      // 2. Build ZIP in-memory with JSZip
      const zip = new JSZip();

      for (const item of manifestFiles) {
        try {
          const fileBlob = await fetch(item.fileUrl).then((r) => r.blob());
          // relativePath preserves the nested directory structure
          zip.file(item.relativePath, fileBlob);
        } catch (downloadErr) {
          console.warn(`Failed to fetch file: ${item.name}`, downloadErr);
        }
      }

      const zipContent = await zip.generateAsync({ type: "blob" });

      // 3. Trigger browser download
      const downloadUrl = URL.createObjectURL(zipContent);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `droply-download-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      addToast("ZIP archive downloaded successfully!", "success");
    } catch (err: unknown) {
      console.error("ZIP download error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to download ZIP archive";
      addToast(msg, "error");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === "all"
                ? "All Files"
                : activeTab === "starred"
                  ? "Starred Files"
                  : "Trash Bin"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {activeTab === "all"
                ? "Organize, browse, and manage all your documents and media"
                : activeTab === "starred"
                  ? "Bookmarked essential files and folders"
                  : "Files here can be restored or purged permanently"}
            </p>
          </div>

          {activeTab === "all" && (
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setIsCreateFolderOpen(true)}
                leftIcon={<FolderPlus className="w-4 h-4 text-amber-500" />}
              >
                New Folder
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsUploadOpen(true)}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                Upload Files
              </Button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <FileTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          trashCount={trashCount}
          onEmptyTrash={handleEmptyTrash}
        />

        {/* Breadcrumb Trail (only on All Files tab when not searching) */}
        {activeTab === "all" && !searchQuery && (
          <FolderNavigation
            breadcrumbs={breadcrumbs}
            onNavigate={handleNavigate}
          />
        )}

        {/* Contextual Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedIds.length}
          activeTab={activeTab}
          onDeselectAll={() => setSelectedIds([])}
          onDownloadZip={handleDownloadZip}
          onBatchStar={handleBatchStar}
          onBatchTrash={handleBatchTrash}
          onBatchDelete={handleBatchDelete}
          isDownloadingZip={isDownloadingZip}
        />

        {/* Loading Spinner or Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm">Loading files...</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            tab={activeTab}
            isSearch={Boolean(searchQuery.trim())}
            onUploadClick={() => setIsUploadOpen(true)}
            onCreateFolderClick={() => setIsCreateFolderOpen(true)}
          />
        ) : (
          <FileTable
            items={items}
            selectedIds={selectedIds}
            onSelectToggle={handleSelectToggle}
            onSelectAllToggle={handleSelectAllToggle}
            onFolderClick={(folderId) => handleNavigate(folderId)}
            onFileClick={(file) => setPreviewFile(file)}
            onToggleStar={handleToggleStar}
            onToggleTrash={handleToggleTrash}
            onPermanentDelete={handlePermanentDelete}
            activeTab={activeTab}
          />
        )}
      </main>

      {/* Modals */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        parentId={currentParentId}
        onUploadSuccess={() => {
          fetchFiles();
          setIsUploadOpen(false);
        }}
      />

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        parentId={currentParentId}
        onFolderCreated={() => {
          fetchFiles();
        }}
      />

      <FilePreviewModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
