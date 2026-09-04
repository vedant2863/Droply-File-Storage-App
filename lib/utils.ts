import type { FileCategory } from "@/types";

/**
 * Format bytes into human readable file size
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format timestamp into relative or friendly string
 */
export function formatRelativeTime(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Classify file MIME type into an icon category
 */
export function getFileCategory(
  mimeType: string = "",
  isFolder: boolean = false,
): FileCategory {
  if (isFolder || mimeType === "folder") return "folder";

  const lower = mimeType.toLowerCase();

  if (lower.startsWith("image/")) return "image";
  if (lower === "application/pdf" || lower.endsWith("/pdf")) return "pdf";
  if (lower.startsWith("video/")) return "video";
  if (lower.startsWith("audio/")) return "audio";
  if (
    lower.includes("zip") ||
    lower.includes("tar") ||
    lower.includes("gzip") ||
    lower.includes("compressed")
  ) {
    return "archive";
  }
  if (
    lower.includes("javascript") ||
    lower.includes("typescript") ||
    lower.includes("json") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("python") ||
    lower.includes("sql") ||
    lower.includes("markdown")
  ) {
    return "code";
  }
  if (
    lower.includes("word") ||
    lower.includes("text/plain") ||
    lower.includes("document") ||
    lower.includes("msword") ||
    lower.includes("officedocument")
  ) {
    return "document";
  }

  return "other";
}

/**
 * Class names utility helper
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
