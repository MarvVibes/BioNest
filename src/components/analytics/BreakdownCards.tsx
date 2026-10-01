'use client';

import React from 'react';
import {
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Compass,
} from 'lucide-react';

export interface BreakdownItem {
  label: string;
  count: number;
}

interface BreakdownCardsProps {
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
  devices: BreakdownItem[];
  totalViews: number;
}

export default function BreakdownCards({
  referrers,
  countries,
  devices,
  totalViews,
}: BreakdownCardsProps) {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Referrers */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Top Referrers</h3>
        </div>

        {referrers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500 py-8">
            No referrer data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {referrers.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{item.label}</span>
                    <span className="text-slate-400">
                      {item.count} <span className="text-slate-600">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Countries */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Visitor Countries</h3>
        </div>

        {countries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500 py-8">
            No country data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {countries.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300 font-mono">
                      {item.label}
                    </span>
                    <span className="text-slate-400">
                      {item.count} <span className="text-slate-600">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Devices */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Device Breakdown</h3>
        </div>

        {devices.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500 py-8">
            No device data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {devices.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(item.label)}
                      <span className="font-medium text-slate-300 capitalize">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      {item.count} <span className="text-slate-600">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
