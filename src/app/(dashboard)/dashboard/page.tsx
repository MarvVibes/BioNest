'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Plus,
  Share2,
  Eye,
  EyeOff,
  Sparkles,
  LinkIcon,
  MessageCircle,
  Loader2,
  Share,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProfileHeaderEditor from '@/components/dashboard/ProfileHeaderEditor';
import LinkItem from '@/components/dashboard/LinkItem';
import LinkModal from '@/components/dashboard/LinkModal';
import SocialLinksModal, { SocialLinkItem } from '@/components/dashboard/SocialLinksModal';
import PhonePreview, { BioLink, ProfileData } from '@/components/dashboard/PhonePreview';
import { DEFAULT_THEME, ThemeConfig } from '@/lib/themes';

export default function DashboardLinksPage() {
  const [profile, setProfile] = useState<ProfileData>({
    username: 'username',
    display_name: 'Your Name',
    bio: '',
    theme: DEFAULT_THEME,
  });
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch real user data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // 1. Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData) {
          setProfile({
            id: profileData.id,
            username: profileData.username,
            display_name: profileData.display_name || profileData.username,
            bio: profileData.bio,
            avatar_url: profileData.avatar_url,
            theme: profileData.theme || DEFAULT_THEME,
          });
        }

        // 2. Fetch Links
        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('profile_id', user.id)
          .order('position', { ascending: true });

        if (linksData) {
          setLinks(linksData);
        }

        // 3. Fetch Social Links
        const { data: socialsData } = await supabase
          .from('social_links')
          .select('*')
          .eq('profile_id', user.id)
          .order('position', { ascending: true });

        if (socialsData) {
          setSocialLinks(socialsData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  // Handle Drag Reorder
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newLinks = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          position: index,
        }));

        // Persist new positions to database
        const updates = newLinks.map((item) =>
          supabase
            .from('links')
            .update({ position: item.position })
            .eq('id', item.id)
        );
        Promise.all(updates).catch((err) => console.error('Failed to persist link order:', err));

        return newLinks;
      });
    }
  };

  // Toggle link active
  const handleToggleActive = async (id: string, active: boolean) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_active: active } : l))
    );
    try {
      await supabase.from('links').update({ is_active: active }).eq('id', id);
    } catch (err) {
      console.error('Failed to toggle link active state:', err);
    }
  };

  // Save Link (Add or Edit)
  const handleSaveLink = async (linkData: Partial<BioLink>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (linkData.id) {
      // Edit
      const { error } = await supabase
        .from('links')
        .update({
          type: linkData.type,
          title: linkData.title,
          url: linkData.url,
          whatsapp_number: linkData.whatsapp_number,
          message: linkData.message,
          show_from: linkData.show_from,
          show_until: linkData.show_until,
        })
        .eq('id', linkData.id);

      if (!error) {
        setLinks((prev) =>
          prev.map((l) => (l.id === linkData.id ? ({ ...l, ...linkData } as BioLink) : l))
        );
      }
    } else {
      // Create
      const newPos = links.length;
      const { data, error } = await supabase
        .from('links')
        .insert({
          profile_id: user.id,
          type: linkData.type,
          title: linkData.title,
          url: linkData.url,
          whatsapp_number: linkData.whatsapp_number,
          message: linkData.message,
          position: newPos,
          is_active: true,
          show_from: linkData.show_from,
          show_until: linkData.show_until,
        })
        .select()
        .single();

      if (!error && data) {
        setLinks((prev) => [...prev, data]);
      }
    }
  };

  // Delete Link
  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setLinks((prev) => prev.filter((l) => l.id !== id));
    try {
      await supabase.from('links').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  // Save Social Links
  const handleSaveSocialLinks = async (updatedSocials: SocialLinkItem[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setSocialLinks(updatedSocials);

    try {
      // Delete existing and insert fresh list
      await supabase.from('social_links').delete().eq('profile_id', user.id);

      if (updatedSocials.length > 0) {
        const rows = updatedSocials.map((s, idx) => ({
          profile_id: user.id,
          platform: s.platform,
          url: s.url,
          position: idx,
        }));
        await supabase.from('social_links').insert(rows);
      }
    } catch (err) {
      console.error('Failed to update social links:', err);
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
      {/* LEFT COLUMN: Links Editor (lg:col-span-7) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Profile Card */}
        <ProfileHeaderEditor
          profile={profile}
          onUpdate={(updated) => setProfile((p) => ({ ...p, ...updated }))}
        />

        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingLink(null);
              setIsLinkModalOpen(true);
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Link or Button</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSocialModalOpen(true)}
            className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Share className="w-3.5 h-3.5 text-emerald-400" />
            <span>Social Icons ({socialLinks.length})</span>
          </button>
        </div>

        {/* Links Sortable List */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">You have no links yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add your WhatsApp contact, shop, music, social channels, or portfolio to share with your visitors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingLink(null);
                  setIsLinkModalOpen(true);
                }}
                className="mt-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create your first link</span>
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {links.map((link) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onToggleActive={handleToggleActive}
                      onEdit={(l) => {
                        setEditingLink(l);
                        setIsLinkModalOpen(true);
                      }}
                      onDelete={handleDeleteLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Live Phone Preview (lg:col-span-5) */}
      <div className="hidden lg:block lg:col-span-5 sticky top-20">
        <div className="text-center mb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Live Preview
          </span>
        </div>
        <PhonePreview
          profile={profile}
          links={links}
          socialLinks={socialLinks}
          theme={profile.theme || DEFAULT_THEME}
        />
      </div>

      {/* Mobile Floating Preview Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="py-3 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-2xl shadow-emerald-500/50 transition-all"
        >
          {showMobilePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showMobilePreview ? 'Close Preview' : 'Phone Preview'}</span>
        </button>
      </div>

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/90 p-4 flex flex-col items-center justify-center animate-in fade-in">
          <button
            type="button"
            onClick={() => setShowMobilePreview(false)}
            className="mb-4 py-2 px-4 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
          >
            Back to Editor
          </button>
          <PhonePreview
            profile={profile}
            links={links}
            socialLinks={socialLinks}
            theme={profile.theme || DEFAULT_THEME}
          />
        </div>
      )}

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setEditingLink(null);
        }}
        linkToEdit={editingLink}
        onSave={handleSaveLink}
      />

      {/* Social Links Modal */}
      <SocialLinksModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        socialLinks={socialLinks}
        onSave={handleSaveSocialLinks}
      />
    </div>
  );
}
