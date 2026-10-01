'use client';

import React from 'react';
import {
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
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

// Flag mapping
const getCountryFlag = (code: string) => {
  const c = code.toUpperCase();
  switch (c) {
    case 'NG':
      return '🇳🇬 Nigeria';
    case 'GB':
    case 'UK':
      return '🇬🇧 United Kingdom';
    case 'US':
      return '🇺🇸 United States';
    case 'GH':
      return '🇬🇭 Ghana';
    case 'KE':
      return '🇰🇪 Kenya';
    case 'ZA':
      return '🇿🇦 South Africa';
    case 'CA':
      return '🇨🇦 Canada';
    case 'DE':
      return '🇩🇪 Germany';
    default:
      return `🌐 ${code}`;
  }
};

export default function BreakdownCards({
  referrers,
  countries,
  devices,
  totalViews,
}: BreakdownCardsProps) {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-[#1E392A]" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-[#71716E]" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-[#191919]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Referrers */}
      <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-4 h-4 text-[#1E392A]" />
          <h3 className="text-sm font-bold text-[#191919]">Top Referrers</h3>
        </div>

        {referrers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8C8C87] py-8">
            No referrer data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {referrers.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#191919]">{item.label}</span>
                    <span className="text-[#71716E] font-medium">
                      {item.count} <span className="text-[#8C8C87]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1E392A] h-full rounded-full"
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
      <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-[#1E392A]" />
          <h3 className="text-sm font-bold text-[#191919]">Visitor Countries</h3>
        </div>

        {countries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8C8C87] py-8">
            No country data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {countries.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#191919]">
                      {getCountryFlag(item.label)}
                    </span>
                    <span className="text-[#71716E] font-medium">
                      {item.count} <span className="text-[#8C8C87]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1E392A] h-full rounded-full"
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
      <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-4 h-4 text-[#1E392A]" />
          <h3 className="text-sm font-bold text-[#191919]">Devices</h3>
        </div>

        {devices.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8C8C87] py-8">
            No device data yet
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {devices.map((item) => {
              const pct = totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#191919] flex items-center gap-1.5 capitalize">
                      {getDeviceIcon(item.label)}
                      {item.label}
                    </span>
                    <span className="text-[#71716E] font-medium">
                      {item.count} <span className="text-[#8C8C87]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E5E3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1E392A] h-full rounded-full"
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
