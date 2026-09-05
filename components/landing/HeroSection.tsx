"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { VaultPreview } from "./VaultPreview";

export function HeroSection() {
  const [copiedDemo, setCopiedDemo] = useState(false);

  const copyDemoCreds = () => {
    navigator.clipboard.writeText("demo@droply.com / password123");
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-linear-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Micro Grid Ambient Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Text & Badges */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Next.js 16 & React 19 Architecture</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[11px] opacity-90">
              v2.4 Production
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Store, Nest & Stream.
            <br />
            <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Zero Bottleneck
            </span>{" "}
            Cloud Files.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Droply delivers infinite folder recursion, instant client-side JSZip
            packaging, cryptographically verified dual-token JWT sessions, and
            direct-to-CDN uploads powered by ImageKit and PostgreSQL 16.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200"
            >
              <Terminal className="w-4 h-4 text-blue-500" />
              <span>Open Live Dashboard</span>
            </Link>
          </div>

          {/* Demo Credentials Quick-Copy Pill */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Demo Account:</span>
            <code className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800/80 font-mono text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60">
              demo@droply.com / password123
            </code>
            <button
              onClick={copyDemoCreds}
              className="hover:text-blue-500 transition p-1"
              title="Copy credentials"
            >
              {copiedDemo ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Interactive Hero Studio Preview */}
        <VaultPreview />
      </div>
    </section>
  );
}
