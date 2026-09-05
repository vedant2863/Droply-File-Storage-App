"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/lib/utils";
import {
  User as UserIcon,
  Mail,
  HardDrive,
  Files,
  Calendar,
  ShieldCheck,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const totalUsedBytes = user?.stats?.totalSize || 0;
  const totalFiles = user?.stats?.totalFiles || 0;
  const storageLimitBytes = 5 * 1024 * 1024 * 1024; // 5 GB default free plan
  const storagePercentage = Math.min(
    100,
    Math.round((totalUsedBytes / storageLimitBytes) * 100),
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Account & Storage
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile information and cloud storage limits.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading profile...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Identity Card */}
            <div className="md:col-span-1 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {getInitials(user?.name)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {user?.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Account</span>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={signOut}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Profile Details & Storage Card */}
            <div className="md:col-span-2 space-y-6">
              {/* Storage Usage Card */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Cloud Storage
                      </h4>
                      <p className="text-xs text-slate-400">
                        ImageKit CDN Integration
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                    {storagePercentage}% Used
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, storagePercentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatFileSize(totalUsedBytes)} used</span>
                  <span>{formatFileSize(storageLimitBytes)} total</span>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <Files className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Total Files
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {totalFiles}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Security
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      JWT Auto-Rotating
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Credentials Summary */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Account Details
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> Full Name
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {user?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {user?.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Password Status
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Protected via bcryptjs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
