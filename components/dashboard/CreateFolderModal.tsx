"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FolderPlus } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
  onFolderCreated: () => void;
}
import type { CreateFolderModalProps } from "@/types";

export type { CreateFolderModalProps };

export function CreateFolderModal({
  isOpen,
  onClose,
  parentId,
  onFolderCreated,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("Please enter a folder name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create folder");
      }

      addToast(`Folder "${folderName.trim()}" created`, "success");
      setFolderName("");
      onFolderCreated();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create folder";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setFolderName("");
        setError("");
        onClose();
      }}
      title="Create New Folder"
      maxWidth="sm"
    >
      <form onSubmit={handleCreate} className="space-y-4">
        <Input
          label="Folder Name"
          placeholder="e.g., Project Proposals"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
          leftIcon={<FolderPlus className="w-4 h-4" />}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<FolderPlus className="w-4 h-4" />}
          >
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
}
