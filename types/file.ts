/**
 * File, Folder, and Storage Types
 */

import type { files } from "@/lib/db/schema";

export type FileRecord = typeof files.$inferSelect;
export type NewFileRecord = typeof files.$inferInsert;

export type FileCategory =
  | "folder"
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "code"
  | "archive"
  | "document"
  | "other";

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export type ActiveTab = "all" | "starred" | "trash";

export interface DownloadFileItem {
  id: string;
  name: string;
  fileUrl: string;
  relativePath: string;
  size: number;
}

export interface UploadTask {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
}

export type BatchAction = "star" | "unstar" | "trash" | "restore" | "delete";
