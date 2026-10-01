'use client';

import React, { useState } from 'react';
import { Camera, Check, Loader2, Pencil } from 'lucide-react';
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
    <div className="p-6 rounded-[28px] bg-white border border-[#E5E5E3] shadow-xs mb-6 transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#F3F3F1] border border-[#E5E5E3] overflow-hidden flex items-center justify-center shadow-xs">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-[#1E392A] animate-spin" />
            ) : profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-extrabold text-[#191919]">
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'B'}
              </span>
            )}
          </div>
          <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
            <Camera className="w-4 h-4 text-white" />
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
                <label className="block text-[11px] font-semibold text-[#71716E] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#71716E] mb-1">
                  Bio (up to 160 characters)
                </label>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-xs font-medium resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#575753] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveText}
                  className="px-4 py-1.5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#191919] tracking-tight">
                    {profile.display_name || profile.username}
                  </h3>
                  <p className="text-xs font-mono text-[#71716E]">
                    bionest.link/<strong className="text-[#1E392A]">{profile.username}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#191919] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              {profile.bio ? (
                <p className="text-xs text-[#575753] mt-2 leading-relaxed line-clamp-2">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-xs text-[#9E9E99] italic mt-1.5">
                  No bio yet. Tap Edit to add a headline or short description.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
