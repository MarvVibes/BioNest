'use client';

import React from 'react';
import { MousePointerClick } from 'lucide-react';

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
    <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#191919]">Top Performing Links</h3>
          <p className="text-xs text-[#71716E]">Click attribution per button</p>
        </div>
      </div>

      {links.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8C8C87] border border-dashed border-[#E5E5E3] rounded-2xl bg-[#FAF9F5]">
          <MousePointerClick className="w-6 h-6 mx-auto mb-2 text-[#B5B5B0]" />
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
                className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E5E3] space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-md bg-[#E5E5E3] text-[#191919] font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#191919] truncate">
                      {link.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-white border border-[#E5E5E3] text-[#71716E] px-1.5 py-0.5 rounded shrink-0">
                      {link.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-[#1E392A]">
                      {link.clicks.toLocaleString()} clicks
                    </span>
                    <span className="text-[#71716E] text-[11px] font-semibold">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1E392A] h-full rounded-full transition-all duration-500"
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
