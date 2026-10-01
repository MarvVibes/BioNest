'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Check, Save, Loader2, Sparkles } from 'lucide-react';
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
      <div className="flex items-center justify-center py-24 text-[#71716E]">
        <Loader2 className="w-7 h-7 animate-spin text-[#1E392A]" />
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
            <h1 className="text-2xl font-extrabold text-[#191919] tracking-tight flex items-center gap-2.5">
              <span>Themes & Appearance</span>
            </h1>
            <p className="text-xs text-[#71716E] mt-1">
              Choose from signature curated themes or customize buttons, fonts, and colors
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveTheme}
            className="py-2.5 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
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
        <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
              Curated Themes ({BUILT_IN_THEMES.length})
            </h2>
            <span className="text-[11px] text-[#71716E]">Click to preview live</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BUILT_IN_THEMES.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 overflow-hidden ${
                    isSelected
                      ? 'border-[#1E392A] ring-2 ring-[#1E392A]/20 shadow-md scale-[1.02]'
                      : 'border-[#E5E5E3] hover:border-[#B5B5B0] hover:shadow-xs'
                  }`}
                  style={{ background: preset.background }}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: preset.badgeBg || 'rgba(0,0,0,0.2)',
                        color: preset.pageTextColor,
                      }}
                    >
                      {preset.category}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#1E392A] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Mini button representation */}
                  <div
                    className={`w-full py-1.5 px-2 text-[10px] text-center font-semibold shadow-xs ${preset.buttonRadius}`}
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
        <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs space-y-6">
          <h2 className="text-xs font-bold text-[#191919] uppercase tracking-wider">
            Custom Appearance Controls
          </h2>

          {/* Button Shape */}
          <div>
            <label className="block text-xs font-bold text-[#191919] mb-2">
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
                  className={`py-2.5 px-3 text-xs font-semibold border text-center transition-all ${
                    s.radius
                  } ${
                    activeTheme.buttonRadius === s.radius
                      ? 'border-[#1E392A] bg-[#1E392A] text-white shadow-xs'
                      : 'border-[#E5E5E3] bg-[#FAF9F5] text-[#575753] hover:text-[#191919]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Choice */}
          <div>
            <label className="block text-xs font-bold text-[#191919] mb-2">
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
                      ? 'border-[#1E392A] bg-[#1E392A] text-white shadow-xs'
                      : 'border-[#E5E5E3] bg-[#FAF9F5] text-[#575753] hover:text-[#191919]'
                  }`}
                >
                  <span className="font-bold">{font}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-[#191919] mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.background.startsWith('#') ? activeTheme.background : '#1e392a'}
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      background: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-9 h-9 rounded-xl border border-[#D8D8D5] cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs font-mono text-[#71716E]">
                  {activeTheme.background.slice(0, 10)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#191919] mb-1.5">
                Button Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.buttonBg.startsWith('#') ? activeTheme.buttonBg : '#ffffff'}
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      buttonBg: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-9 h-9 rounded-xl border border-[#D8D8D5] cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs font-mono text-[#71716E]">
                  {activeTheme.buttonBg.slice(0, 10)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#191919] mb-1.5">
                Button Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.buttonTextColor.startsWith('#') ? activeTheme.buttonTextColor : '#1e392a'}
                  onChange={(e) =>
                    setActiveTheme((t) => ({
                      ...t,
                      buttonTextColor: e.target.value,
                      id: 'custom',
                    }))
                  }
                  className="w-9 h-9 rounded-xl border border-[#D8D8D5] cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs font-mono text-[#71716E]">
                  {activeTheme.buttonTextColor.slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Sticky Phone Preview */}
      <div className="hidden lg:block lg:col-span-5 sticky top-20">
        <div className="text-center mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#71716E]">
            Live Preview
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
