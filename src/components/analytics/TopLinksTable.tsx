'use client';

import React from 'react';
import { ExternalLink, MousePointerClick } from 'lucide-react';

export interface TopLinkStat {
  id: string;
  title: string;
  type: string;
  url?: string | null;
  clicks: number;
}

interface TopLinksTableProps {
  links: TopLinkStat[];
  totalClicks: number;
}

export default function TopLinksTable({ links, totalClicks }: TopLinksTableProps) {
  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Top Performing Links</h3>
          <p className="text-xs text-slate-400">Click attribution per button</p>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          <MousePointerClick className="w-6 h-6 mx-auto mb-2 text-slate-600" />
          No link clicks recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, idx) => {
            const percentage =
              totalClicks > 0
                ? Math.round((link.clicks / totalClicks) * 100)
                : 0;

            return (
              <div
                key={link.id || idx}
                className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200 truncate">
                      {link.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0">
                      {link.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-emerald-400">
                      {link.clicks.toLocaleString()} clicks
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
