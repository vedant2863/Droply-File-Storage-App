"use client";

import React, { useState } from "react";
import {
  Folder,
  FileText,
  Code2,
  Film,
  FileArchive,
  Download,
  Star,
  Zap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface MockFile {
  id: string;
  name: string;
  type: "code" | "pdf" | "video" | "archive";
  size: string;
  modified: string;
}

export function VaultPreview() {
  const [selectedFolder, setSelectedFolder] = useState<string>("releases");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([
    "file-1",
    "file-3",
  ]);

  const toggleFileSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const mockFolders = [
    { id: "releases", name: "Production Releases", count: 4 },
    { id: "assets", name: "Brand & Design Kit", count: 2 },
    { id: "legal", name: "Compliance & Audits", count: 1 },
  ];

  const mockFilesByFolder: Record<string, MockFile[]> = {
    releases: [
      {
        id: "file-1",
        name: "droply-core-engine-v2.4.ts",
        type: "code",
        size: "18.4 KB",
        modified: "20 min ago",
      },
      {
        id: "file-2",
        name: "turbopack-build-bundle.zip",
        type: "archive",
        size: "42.8 MB",
        modified: "1 hour ago",
      },
      {
        id: "file-3",
        name: "security-audit-report-2026.pdf",
        type: "pdf",
        size: "3.2 MB",
        modified: "Yesterday",
      },
      {
        id: "file-4",
        name: "architecture-walkthrough.mp4",
        type: "video",
        size: "86.5 MB",
        modified: "2 days ago",
      },
    ],
    assets: [
      {
        id: "file-5",
        name: "brand-guidelines-2026.pdf",
        type: "pdf",
        size: "12.1 MB",
        modified: "3 days ago",
      },
      {
        id: "file-6",
        name: "logo-vectors-package.zip",
        type: "archive",
        size: "15.4 MB",
        modified: "4 days ago",
      },
    ],
    legal: [
      {
        id: "file-7",
        name: "terms-of-service-v3.pdf",
        type: "pdf",
        size: "1.8 MB",
        modified: "Last week",
      },
    ],
  };

  const currentFiles = mockFilesByFolder[selectedFolder] || [];

  return (
    <div className="relative max-w-5xl mx-auto rounded-3xl p-2 bg-linear-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-300/80 dark:border-slate-700/80 shadow-2xl shadow-blue-900/10 dark:shadow-blue-950/40">
      <div className="rounded-2xl bg-white dark:bg-[#0b111e] overflow-hidden border border-slate-200/90 dark:border-slate-800">
        {/* Simulated Window Title Bar */}
        <div className="px-4 py-3 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-xs font-mono font-semibold text-slate-400">
              droply://vault-cluster-01/
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Postgres Port 5433 Synced</span>
            </span>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Left Directory Sidebar */}
          <div className="md:col-span-4 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Hierarchical Folders
            </div>

            <div className="space-y-1">
              {mockFolders.map((folder) => {
                const active = selectedFolder === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder
                        className={`w-4 h-4 ${
                          active ? "text-white" : "text-blue-500"
                        }`}
                      />
                      <span>{folder.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {folder.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Storage Allocation Gauge */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Storage Quota
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  1.4 GB / 5.0 GB
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 w-[28%] rounded-full" />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Direct ImageKit CDN Delivery</span>
              </div>
            </div>
          </div>

          {/* Right File Table & Batch Action Dock */}
          <div className="md:col-span-8 p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Breadcrumbs Trail */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Root</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {selectedFolder}
                </span>
              </div>

              {/* File Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100/75 dark:bg-slate-900/80 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 pl-3 w-8">#</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 pr-3 text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {currentFiles.map((f) => {
                      const isSelected = selectedFiles.includes(f.id);
                      return (
                        <tr
                          key={f.id}
                          onClick={() => toggleFileSelect(f.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50/80 dark:bg-blue-950/40"
                              : "hover:bg-slate-50 dark:hover:bg-slate-850"
                          }`}
                        >
                          <td className="py-2.5 pl-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-medium flex items-center gap-2 truncate">
                            {f.type === "code" && (
                              <Code2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                            {f.type === "pdf" && (
                              <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            {f.type === "video" && (
                              <Film className="w-4 h-4 text-purple-500 shrink-0" />
                            )}
                            {f.type === "archive" && (
                              <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate">{f.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {f.size}
                          </td>
                          <td className="py-2.5 pr-3 text-right text-slate-400">
                            {f.modified}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Batch Action Pill */}
            {selectedFiles.length > 0 && (
              <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                    {selectedFiles.length} Selected
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Recursive JSZip Ready
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm transition">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ZIP</span>
                  </button>
                  <button className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
