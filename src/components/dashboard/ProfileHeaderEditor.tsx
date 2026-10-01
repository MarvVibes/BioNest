'use client';

import React, { useState } from 'react';
import { Camera, Check, Loader2, Sparkles } from 'lucide-react';
import { compressAndResizeImage } from '@/lib/image-compression';
import { createClient } from '@/lib/supabase/client';
import { ProfileData } from './PhonePreview';

interface ProfileHeaderEditorProps {
  profile: ProfileData;
  onUpdate: (updated: Partial<ProfileData>) => void;
}

export default function ProfileHeaderEditor({
  profile,
  onUpdate,
}: ProfileHeaderEditorProps) {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const compressed = await compressAndResizeImage(file);
      const filePath = `${user.id}/avatar-${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressed, {
          upsert: true,
          contentType: 'image/webp',
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const newAvatarUrl = publicUrlData.publicUrl;

        await supabase
          .from('profiles')
          .update({ avatar_url: newAvatarUrl })
          .eq('id', user.id);

        onUpdate({ avatar_url: newAvatarUrl });
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveText = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        })
        .eq('id', user.id);

      onUpdate({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile info:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            ) : profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-slate-300">
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'B'}
              </span>
            )}
          </div>
          <label className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Info or Edit Form */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Bio (up to 160 chars)
                </label>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveText}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center gap-1"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {profile.display_name || profile.username}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400">
                    bionest.link/{profile.username}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              {profile.bio ? (
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-xs text-slate-600 italic mt-1.5">
                  No bio yet. Add one to describe yourself.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
