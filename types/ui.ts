/**
 * UI Component and Feedback Types
 */

import React from "react";
import type { FileRecord, ActiveTab, BreadcrumbItem } from "./file";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  showCloseButton?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export interface FileIconProps {
  type?: string;
  isFolder?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface FolderNavigationProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
}

export interface FileTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  trashCount?: number;
  onEmptyTrash?: () => void;
}

export interface BatchActionBarProps {
  selectedCount: number;
  activeTab: ActiveTab;
  onDeselectAll: () => void;
  onDownloadZip: () => void;
  onBatchStar: (star: boolean) => void;
  onBatchTrash: (trash: boolean) => void;
  onBatchDelete: () => void;
  isDownloadingZip?: boolean;
  isLoading?: boolean;
}

export interface FileTableProps {
  items: FileRecord[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: () => void;
  onFolderClick: (folderId: string) => void;
  onFileClick: (file: FileRecord) => void;
  onToggleStar: (fileId: string) => void;
  onToggleTrash: (fileId: string) => void;
  onPermanentDelete: (file: FileRecord) => void;
  activeTab: ActiveTab;
}

export interface FilePreviewModalProps {
  file: FileRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
  onUploadSuccess: () => void;
}

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string | null;
  onFolderCreated: () => void;
}

export interface EmptyStateProps {
  tab: ActiveTab;
  isSearch?: boolean;
  onUploadClick?: () => void;
  onCreateFolderClick?: () => void;
}
