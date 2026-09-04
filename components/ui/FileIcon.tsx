"use client";

import React from "react";
import {
  Folder,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  Code2,
  Archive,
  File,
} from "lucide-react";
import { getFileCategory } from "@/lib/utils";

import type { FileIconProps } from "@/types";

export type { FileIconProps };

export function FileIcon({
  type = "",
  isFolder = false,
  className = "",
  size = "md",
}: FileIconProps) {
  const category = getFileCategory(type, isFolder);

  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const iconClass = `${sizeMap[size]} ${className}`;

  switch (category) {
    case "folder":
      return (
        <Folder className={`${iconClass} text-amber-500 fill-amber-500/20`} />
      );
    case "image":
      return <ImageIcon className={`${iconClass} text-purple-500`} />;
    case "pdf":
      return <FileText className={`${iconClass} text-rose-500`} />;
    case "video":
      return <Film className={`${iconClass} text-indigo-500`} />;
    case "audio":
      return <Music className={`${iconClass} text-emerald-500`} />;
    case "code":
      return <Code2 className={`${iconClass} text-cyan-500`} />;
    case "archive":
      return <Archive className={`${iconClass} text-amber-600`} />;
    case "document":
      return <FileText className={`${iconClass} text-blue-500`} />;
    default:
      return <File className={`${iconClass} text-slate-400`} />;
  }
}
