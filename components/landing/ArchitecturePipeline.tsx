import React from "react";

export function ArchitecturePipeline() {
  const steps = [
    {
      num: "01",
      color: "text-blue-600 dark:text-blue-400",
      title: "Direct Client Signature",
      desc: "Your browser requests an ephemeral HMAC cryptographic signature from /api/imagekit-auth, verifying your session via JWT cookies.",
    },
    {
      num: "02",
      color: "text-indigo-600 dark:text-indigo-400",
      title: "Edge Upload Streaming",
      desc: "Files stream directly from the client to ImageKit CDN storage. Large binaries never touch your application server, guaranteeing blazing transfer speeds.",
    },
    {
      num: "03",
      color: "text-cyan-600 dark:text-cyan-400",
      title: "Relational Postgres Indexing",
      desc: "Metadata, folder parent IDs, and file URLs are committed in a single ACID transaction using Drizzle ORM and PostgreSQL 16.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            How Data Flows in Droply
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A streamlined three-step pipeline ensuring speed, zero server
            overload, and maximum privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative"
            >
              <div className={`text-3xl font-black font-mono ${step.color}`}>
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
