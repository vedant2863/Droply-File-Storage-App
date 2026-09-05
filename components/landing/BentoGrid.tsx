import React from "react";
import {
  FolderTree,
  Lock,
  FileArchive,
  Cloud,
  Eye,
  CheckCircle2,
} from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#070a12] border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            Built for High-Scale Workloads
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Engineered from the Database Up.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            No superficial wrappers. Every system in Droply is designed for
            resilience, speed, and cryptographic security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Infinite Depth Hierarchy (Large Span) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 group space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderTree className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Infinite Recursive Folder Tree
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                Self-referencing{" "}
                <code className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                  parentId
                </code>{" "}
                relations in PostgreSQL allow unconstrained nested
                subdirectories. Interactive breadcrumb trails resolve instantly
                via recursive database traversal.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-500 space-y-1.5">
              <div className="text-blue-500">
                SELECT * FROM files WHERE parent_id = $1 AND user_id = $2;
              </div>
              <div className="text-emerald-500">
                ✔ Cascading soft-delete & recursive trash quarantine
              </div>
              <div className="text-slate-400">
                ✔ Sub-5ms traversal with indexed foreign keys
              </div>
            </div>
          </div>

          {/* Bento 2: Dual-Token JWT Auth */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Dual-Token JWT
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                15-minute ephemeral access tokens verified via{" "}
                <code className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                  jose
                </code>{" "}
                paired with 7-day rotated refresh tokens in HttpOnly,
                SameSite=Lax cookies.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Next.js 16 Proxy Protection</span>
            </div>
          </div>

          {/* Bento 3: Hierarchical JSZip Archiving */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileArchive className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Client JSZip Engine
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Select multiple nested folders. Droply recursively compiles the
                hierarchy manifest and zips subdirectories inside your browser —
                zero server CPU spikes.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preserves folder directory tree in ZIP</span>
            </div>
          </div>

          {/* Bento 4: ImageKit Cloud Storage Pipeline */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Cloud className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Edge CDN Uploads
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Client-signed authentication tokens generate secure upload
                tickets to ImageKit CDN edge nodes. Automated purge on permanent
                trash wipe.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Global asset distribution</span>
            </div>
          </div>

          {/* Bento 5: In-App Multi-Format Previews */}
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Eye className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                In-App Rich Previews
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stream video playback, play audio tracks, inspect
                syntax-highlighted code, and read multi-page PDF documents
                without leaving your dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Images, Video, Audio, Code & PDF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
