'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface DailyDataPoint {
  date: string;
  views: number;
  clicks: number;
}

interface TimeseriesChartProps {
  data: DailyDataPoint[];
}

export default function TimeseriesChart({ data }: TimeseriesChartProps) {
  const hasData = data.some((d) => d.views > 0 || d.clicks > 0);

  return (
    <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-[#191919]">Daily Activity</h3>
          <p className="text-xs text-[#71716E]">Views and clicks across the selected period</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1E392A]" />
            <span className="text-[#191919]">Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D2E823] border border-[#B5B5B0]" />
            <span className="text-[#191919]">Clicks</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-[#8C8C87] border border-dashed border-[#E5E5E3] rounded-2xl bg-[#FAF9F5]">
          <p className="font-semibold text-[#191919]">No traffic recorded for this time range yet.</p>
          <p className="text-[11px] text-[#71716E] mt-1">
            Share your link on Instagram, WhatsApp, or Twitter to start tracking real visits.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E392A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1E392A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D2E823" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D2E823" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#8C8C87"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#8C8C87"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E3',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  color: '#191919',
                  fontWeight: 600,
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#1E392A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#B5CB1A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#clicksGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
