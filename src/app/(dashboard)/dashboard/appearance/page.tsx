'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check, Save, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BUILT_IN_THEMES, DEFAULT_THEME, ThemeConfig } from '@/lib/themes';
import PhonePreview, { BioLink, ProfileData } from '@/components/dashboard/PhonePreview';
import { SocialLinkItem } from '@/components/dashboard/SocialLinksModal';

export default function AppearancePage() {
  const [profile, setProfile] = useState<ProfileData>({
    username: 'username',
    display_name: 'Your Name',
    bio: '',
    theme: DEFAULT_THEME,
  });
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          const currentTheme = (profileData.theme as ThemeConfig) || DEFAULT_THEME;
          setProfile({
            id: profileData.id,
            username: profileData.username,
            display_name: profileData.display_name || profileData.username,
            bio: profileData.bio,
            avatar_url: profileData.avatar_url,
            theme: currentTheme,
          });
          setActiveTheme(currentTheme);
        }

        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', user.id)
          .order('position', { ascending: true });

        if (linksData) setLinks(linksData);

        const { data: socialsData } = await supabase
          .from('social_links')
          .select('*')
          .eq('profile_id', user.id)
          .order('position', { ascending: true });

        if (socialsData) setSocialLinks(socialsData);
      } catch (err) {
        console.error('Failed to load appearance data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  const handleSelectPreset = (preset: ThemeConfig) => {
    setActiveTheme(preset);
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ theme: activeTheme })
        .eq('id', user.id);

      if (!error) {
        setProfile((p) => ({ ...p, theme: activeTheme }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save appearance theme:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Theme Presets & Customizer */}
      <div className="lg:col-span-7 space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Palette className="w-6 h-6 text-emerald-400" />
              <span>Themes & Appearance</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Choose from 8 curated themes or customize background, fonts, and button shapes
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveTheme}
            className="py-2.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Theme</span>
              </>
            )}
          </button>
        </div>

        {/* 1. Curated Built-in Themes Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">
            Curated Themes (8)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BUILT_IN_THEMES.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  }`}
                  style={{ background: preset.background }}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: preset.badgeBg || 'rgba(0,0,0,0.4)',
                        color: preset.pageTextColor,
                      }}
                    >
                      {preset.category}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Mini button representation */}
                  <div
                    className={`w-full py-2 px-2 text-[10px] text-center font-medium shadow-sm ${preset.buttonRadius}`}
                    style={{
                      background: preset.buttonBg,
                      color: preset.buttonTextColor,
                      border: preset.buttonBorder || 'none',
                    }}
                  >
                    Button
                  </div>

                  <span
                    className="text-xs font-bold truncate mt-1"
                    style={{ color: preset.pageTextColor }}
                  >
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Custom Style Controls */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-xs">
            Custom Appearance Controls
          </h2>

          {/* Button Shape */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Button Shape
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Square', radius: 'rounded-none' as const },
                { label: 'Rounded', radius: 'rounded-lg' as const },
                { label: 'Curved', radius: 'rounded-2xl' as const },
                { label: 'Pill', radius: 'rounded-full' as const },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() =>
                    setActiveTheme((t) => ({ ...t, buttonRadius: s.radius, id: 'custom' }))
                  }
                  className={`py-2.5 px-3 text-xs font-medium border text-center transition-all ${
                    s.radius
                  } ${
                    activeTheme.buttonRadius === s.radius
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Font Family (Self-Hosted)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  'Inter',
                  'Outfit',
                  'Space Grotesk',
                  'Plus Jakarta Sans',
                  'Playfair Display',
                ] as const
              ).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() =>
                    setActiveTheme((t) => ({ ...t, fontFamily: font, id: 'custom' }))
                  }
                  className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                    activeTheme.fontFamily === font
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Page Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    activeTheme.background.startsWith('#')
                      ? activeTheme.background
                      : '#090d16'
                  }
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      background: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">
                  {activeTheme.background.startsWith('#')
                    ? activeTheme.background
                    : 'Gradient'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Page Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.pageTextColor}
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      pageTextColor: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">
                  {activeTheme.pageTextColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Button Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    activeTheme.buttonBg.startsWith('#')
                      ? activeTheme.buttonBg
                      : '#1e293b'
                  }
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      buttonBg: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">
                  {activeTheme.buttonBg.startsWith('#')
                    ? activeTheme.buttonBg
                    : 'Style'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Button Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.buttonTextColor}
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      buttonTextColor: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">
                  {activeTheme.buttonTextColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Phone Preview */}
      <div className="hidden lg:block lg:col-span-5 sticky top-20">
        <div className="text-center mb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Appearance Live Preview
          </span>
        </div>
        <PhonePreview
          profile={profile}
          links={links}
          socialLinks={socialLinks}
          theme={activeTheme}
        />
      </div>
    </div>
  );
}
