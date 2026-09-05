import React from "react";
import Link from "next/link";
import { Cloud, ArrowUpRight } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Droply Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-500 transition">
              Dashboard
            </Link>
            <Link href="/sign-in" className="hover:text-blue-500 transition">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-blue-500 transition">
              Sign Up
            </Link>
            <a
              href="https://github.com/vedant2863/Droply-File-Storage-App"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-blue-500 transition"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Droply Cloud. All rights reserved.</p>
          <p className="text-slate-400">
            Powered by Next.js 16 • React 19 • Tailwind CSS v4 • Drizzle ORM •
            Docker PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
