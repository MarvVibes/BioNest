'use client';

import React from 'react';
import { Eye, MousePointerClick, Percent, Users } from 'lucide-react';

interface StatsOverviewProps {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
}

export default function StatsOverview({
  totalViews,
  totalClicks,
  uniqueVisitors,
}: StatsOverviewProps) {
  const ctr =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      subtitle: 'Visits to your public page',
    },
    {
      label: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      subtitle: 'Button and link taps',
    },
    {
      label: 'Click-Through Rate',
      value: `${ctr}%`,
      icon: Percent,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      subtitle: 'Clicks per page visit',
    },
    {
      label: 'Unique Visitors',
      value: uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      subtitle: 'Estimated unique visitors',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
