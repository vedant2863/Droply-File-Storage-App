import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  Cloud,
  Shield,
  FolderTree,
  FileArchive,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Layers,
} from "lucide-react";

export default function Home() {
export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "JWT Access & Refresh Security",
      desc: "Short-lived 15-min access tokens and 7-day database-backed refresh tokens via HttpOnly cookies.",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/60",
    },
    {
      icon: FolderTree,
      title: "Deep Nested Folders",
      desc: "Full parent-child directory hierarchy without depth limits, complete with interactive breadcrumbs.",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/60",
    },
    {
      icon: FileArchive,
      title: "Batch ZIP Downloads",
      desc: "Select multiple files and folders to instantly package and download as a structured ZIP archive.",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      icon: Eye,
      title: "In-App Rich Previews",
      desc: "Instant preview modals for images, PDFs, videos, audio, and code without leaving your dashboard.",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/60",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive & Themes",
      desc: "Fluid layout with full dark mode support via next-themes and adaptive touch-friendly drawers.",
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/60",
    },
    {
      icon: Layers,
      title: "ImageKit CDN & Local Postgres",
      desc: "Fast global CDN uploads paired with Docker Compose PostgreSQL 16 on port 5433 and Drizzle ORM.",
      color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60",
    },
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the{" "}
            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              page.tsx
            </code>{" "}
            file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Droply Cloud Storage v2.0 Released</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Effortless Cloud Storage for Modern Teams
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Store, organize, preview, and batch-download your assets with lightning speed.
              Featuring nested folders, secure JWT rotation, and ImageKit CDN.
              Store, organize, preview, and batch-download your assets with
              lightning speed. Featuring nested folders, secure JWT rotation,
              and ImageKit CDN.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
              >
                <span>Open Dashboard</span>
              </Link>
            </div>

            {/* Highlight Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Docker PostgreSQL 16 (Port 5433)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Next.js 16 Proxy Route Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hierarchical JSZip Archiving</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Built for power, simplicity, and speed
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Every feature you need to organize your files seamlessly across devices.
                Every feature you need to organize your files seamlessly across
                devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Droply Storage</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Droply Storage
            </span>
          </div>
          <p>© {new Date().getFullYear()} Droply. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-[14px] w-4"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
      </footer>
    </div>
  );
}
