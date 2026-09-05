import React from "react";

export function ComparisonMatrix() {
  const rows = [
    {
      feature: "Folder Depth",
      droply: "Unlimited parentId tree",
      others: "Often capped or flattened",
    },
    {
      feature: "Recursive ZIP Download",
      droply: "Instant client-side JSZip",
      others: "Queued server background jobs",
    },
    {
      feature: "Session Security",
      droply: "Dual-Token Rotated JWT",
      others: "Single long-lived session cookie",
    },
    {
      feature: "Database Engine",
      droply: "PostgreSQL 16 + Drizzle",
      others: "Proprietary closed storage",
    },
    {
      feature: "Trash Management",
      droply: "Cascading sub-tree purge",
      others: "Orphaned files left behind",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#070a12] border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Why Developers Choose Droply
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comparing Droply&apos;s architecture against generic cloud drives.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6 text-blue-600 dark:text-blue-400">
                  Droply Platform
                </th>
                <th className="py-4 px-6 text-slate-400">Standard Drives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {rows.map((row) => (
                <tr key={row.feature}>
                  <td className="py-4 px-6 font-semibold">{row.feature}</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold">
                    {row.droply}
                  </td>
                  <td className="py-4 px-6 text-slate-400">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
