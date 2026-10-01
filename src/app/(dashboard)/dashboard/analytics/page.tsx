'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatsOverview from '@/components/analytics/StatsOverview';
import TimeseriesChart, { DailyDataPoint } from '@/components/analytics/TimeseriesChart';
import TopLinksTable, { TopLinkStat } from '@/components/analytics/TopLinksTable';
import BreakdownCards, { BreakdownItem } from '@/components/analytics/BreakdownCards';

export default function AnalyticsPage() {
  const [daysRange, setDaysRange] = useState<7 | 30 | 90>(7);
  const [loading, setLoading] = useState(true);

  // Aggregated states
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [timeseriesData, setTimeseriesData] = useState<DailyDataPoint[]>([]);
  const [topLinks, setTopLinks] = useState<TopLinkStat[]>([]);
  const [referrers, setReferrers] = useState<BreakdownItem[]>([]);
  const [countries, setCountries] = useState<BreakdownItem[]>([]);
  const [devices, setDevices] = useState<BreakdownItem[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysRange);
        startDate.setHours(0, 0, 0, 0);

        // 1. Fetch real events for user's profile
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('profile_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true });

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
          setLoading(false);
          return;
        }

        const events = eventsData || [];

        // 2. Fetch user's links for joining click metrics
        const { data: linksData } = await supabase
          .from('links')
          .select('id, title, type, url')
          .eq('profile_id', user.id);

        const linksMap = new Map<string, { title: string; type: string; url?: string | null }>();
        (linksData || []).forEach((l) => linksMap.set(l.id, l));

        // 3. Aggregate totals
        let viewsCount = 0;
        let clicksCount = 0;
        const uniqueVisitorHashes = new Set<string>();

        // Days dictionary for timeseries
        const dayMap = new Map<string, { views: number; clicks: number }>();
        for (let i = daysRange - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dayMap.set(key, { views: 0, clicks: 0 });
        }

        // Breakdown dictionaries
        const linkClicksMap = new Map<string, number>();
        const referrerMap = new Map<string, number>();
        const countryMap = new Map<string, number>();
        const deviceMap = new Map<string, number>();

        events.forEach((ev) => {
          const evDate = new Date(ev.created_at);
          const dateKey = evDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          if (ev.visitor_hash) {
            uniqueVisitorHashes.add(ev.visitor_hash);
          }

          if (ev.type === 'view') {
            viewsCount++;
            if (dayMap.has(dateKey)) {
              dayMap.get(dateKey)!.views++;
            }
            if (ev.referrer) {
              referrerMap.set(ev.referrer, (referrerMap.get(ev.referrer) || 0) + 1);
            }
            if (ev.country) {
              countryMap.set(ev.country, (countryMap.get(ev.country) || 0) + 1);
            }
            if (ev.device) {
              deviceMap.set(ev.device, (deviceMap.get(ev.device) || 0) + 1);
            }
          } else if (ev.type === 'click') {
            clicksCount++;
            if (dayMap.has(dateKey)) {
              dayMap.get(dateKey)!.clicks++;
            }
            if (ev.link_id) {
              linkClicksMap.set(ev.link_id, (linkClicksMap.get(ev.link_id) || 0) + 1);
            }
          }
        });

        setTotalViews(viewsCount);
        setTotalClicks(clicksCount);
        setUniqueVisitors(uniqueVisitorHashes.size);

        // Format timeseries
        const formattedTimeseries: DailyDataPoint[] = [];
        dayMap.forEach((val, key) => {
          formattedTimeseries.push({
            date: key,
            views: val.views,
            clicks: val.clicks,
          });
        });
        setTimeseriesData(formattedTimeseries);

        // Format Top Links
        const formattedTopLinks: TopLinkStat[] = [];
        linkClicksMap.forEach((clicks, linkId) => {
          const linkInfo = linksMap.get(linkId);
          formattedTopLinks.push({
            id: linkId,
            title: linkInfo?.title || 'Unknown Link',
            type: linkInfo?.type || 'standard',
            url: linkInfo?.url,
            clicks,
          });
        });
        formattedTopLinks.sort((a, b) => b.clicks - a.clicks);
        setTopLinks(formattedTopLinks);

        // Format Breakdown Lists
        const sortAndSlice = (map: Map<string, number>): BreakdownItem[] =>
          Array.from(map.entries())
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        setReferrers(sortAndSlice(referrerMap));
        setCountries(sortAndSlice(countryMap));
        setDevices(sortAndSlice(deviceMap));
      } catch (err) {
        console.error('Failed to aggregate real analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [daysRange, supabase]);

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Header with Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#191919] tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-xs text-[#71716E] mt-1">
            Real visitor views, clicks, and geographic origins (no bot noise or IP tracking)
          </p>
        </div>

        {/* Range Selector Pill */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#E5E5E3] shadow-xs self-start sm:self-auto">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDaysRange(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                daysRange === r
                  ? 'bg-[#1E392A] text-white shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[#71716E]">
          <Loader2 className="w-7 h-7 animate-spin text-[#1E392A]" />
        </div>
      ) : (
        <>
          {/* Summary Stats Overview Cards */}
          <StatsOverview
            totalViews={totalViews}
            totalClicks={totalClicks}
            uniqueVisitors={uniqueVisitors}
          />

          {/* Time Series Chart */}
          <TimeseriesChart data={timeseriesData} />

          {/* Top Links Attribution Table */}
          <TopLinksTable links={topLinks} totalClicks={totalClicks} />

          {/* Breakdown Cards: Referrers, Countries, Devices */}
          <BreakdownCards
            referrers={referrers}
            countries={countries}
            devices={devices}
            totalViews={totalViews}
          />
        </>
      )}
    </div>
  );
}
