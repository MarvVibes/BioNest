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
      label: 'Total Pageviews',
      value: totalViews.toLocaleString(),
      icon: Eye,
      iconBg: 'bg-[#F3F3F1] text-[#1E392A]',
      subtitle: 'Visits to your bio link',
    },
    {
      label: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
      iconBg: 'bg-[#D2E823]/25 text-[#1E392A]',
      subtitle: 'Taps on your buttons',
    },
    {
      label: 'Average CTR',
      value: `${ctr}%`,
      icon: Percent,
      iconBg: 'bg-emerald-50 text-emerald-700',
      subtitle: 'Clicks per page visitor',
    },
    {
      label: 'Unique Visitors',
      value: uniqueVisitors.toLocaleString(),
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-700',
      subtitle: 'Distinct daily visitors',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#71716E]">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center shadow-xs`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] text-[#8C8C87] mt-1 font-medium">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
