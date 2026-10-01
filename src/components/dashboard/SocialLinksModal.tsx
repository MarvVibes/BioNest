'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  SocialPlatform,
  socialPlatformList,
  buildSocialUrl,
} from '@/lib/validation';
import { SocialIcon } from '@/components/ui/SocialIcons';

export interface SocialLinkItem {
  id?: string;
  platform: SocialPlatform;
  url: string;
  position: number;
}

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  socialLinks: SocialLinkItem[];
  onSave: (links: SocialLinkItem[]) => Promise<void>;
}

export default function SocialLinksModal({
  isOpen,
  onClose,
  socialLinks,
  onSave,
}: SocialLinksModalProps) {
  const [links, setLinks] = useState<SocialLinkItem[]>(socialLinks);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [inputHandle, setInputHandle] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddPlatform = () => {
    if (!inputHandle.trim()) return;
    const finalUrl = buildSocialUrl(selectedPlatform, inputHandle.trim());

    // Check if platform already added
    const existingIndex = links.findIndex((l) => l.platform === selectedPlatform);
    if (existingIndex >= 0) {
      const updated = [...links];
      updated[existingIndex].url = finalUrl;
      setLinks(updated);
    } else {
      setLinks([
        ...links,
        {
          platform: selectedPlatform,
          url: finalUrl,
          position: links.length,
        },
      ]);
    }
    setInputHandle('');
  };

  const handleRemove = (platform: SocialPlatform) => {
    setLinks(links.filter((l) => l.platform !== platform));
  };

  const handleSaveAndClose = async () => {
    setSaving(true);
    await onSave(links);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#E5E5E3] rounded-[32px] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E5E3]">
          <div>
            <h3 className="text-base font-bold text-[#191919]">Social Icons</h3>
            <p className="text-xs text-[#71716E]">Display icon badges directly under your bio</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing active social links */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
          {links.length === 0 ? (
            <p className="text-xs text-[#9E9E99] text-center py-4">
              No social icons added yet. Select a platform below.
            </p>
          ) : (
            links.map((link) => (
              <div
                key={link.platform}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E5E3] text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-5 h-5 flex items-center justify-center text-[#191919] shrink-0">
                    <SocialIcon platform={link.platform} size={15} />
                  </div>
                  <span className="font-semibold text-[#191919] capitalize">
                    {link.platform}
                  </span>
                  <span className="text-[#71716E] truncate max-w-[170px]">
                    {link.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(link.platform)}
                  className="text-[#9E9E99] hover:text-rose-600 transition-colors ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add new social platform */}
        <div className="p-4 rounded-2xl bg-[#F3F3F1] border border-[#E5E5E3] space-y-3">
          <label className="block text-xs font-bold text-[#191919]">
            Add or Update Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8D8D5] text-xs font-semibold text-[#191919] outline-none capitalize"
              >
                {socialPlatformList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                placeholder="handle or link"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D8D8D5] text-xs text-[#191919] outline-none placeholder:text-[#B5B5B0]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPlatform}
            className="w-full py-2 px-3 rounded-full bg-white border border-[#D8D8D5] hover:bg-[#FAF9F5] text-[#191919] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to profile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-6 pt-3 border-t border-[#E5E5E3]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#71716E] text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAndClose}
            className="flex-1 py-2.5 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Save Social Icons</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
