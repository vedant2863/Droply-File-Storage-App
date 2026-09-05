import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-tr from-blue-600/10 via-indigo-600/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-10 sm:p-16 rounded-3xl bg-linear-to-b from-blue-600 to-indigo-700 text-white text-center space-y-8 shadow-2xl shadow-blue-500/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Deployment Ready</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to take complete control of your files?
          </h2>

          <p className="text-blue-100 text-base max-w-xl mx-auto leading-relaxed">
            Create an account in seconds or explore using our pre-seeded demo
            environment. Free, open-source, and fully extensible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 font-bold text-base shadow-lg transition-all"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-700/80 hover:bg-blue-800 text-white font-bold text-base border border-blue-400/30 transition-all"
            >
              <span>Sign In with Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
