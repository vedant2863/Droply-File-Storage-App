import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  HeroSection,
  BentoGrid,
  ArchitecturePipeline,
  ComparisonMatrix,
  CtaSection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060910] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Interactive Hero with Vault Studio */}
        <HeroSection />

        {/* 6-Pillar Architectural Bento Grid */}
        <BentoGrid />

        {/* 3-Stage Client-to-Postgres Data Pipeline */}
        <ArchitecturePipeline />

        {/* Droply vs Generic Cloud Specification Matrix */}
        <ComparisonMatrix />

        {/* Instant Action CTA Card */}
        <CtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
