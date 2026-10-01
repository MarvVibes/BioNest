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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Social Icons</h3>
            <p className="text-xs text-slate-400">Display icon buttons under your bio</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing active social links */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
          {links.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              No social icons added yet. Select a platform below.
            </p>
          ) : (
            links.map((link) => (
              <div
                key={link.platform}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300 shrink-0">
                    <SocialIcon platform={link.platform} size={15} />
                  </div>
                  <span className="font-medium text-slate-200 capitalize">
                    {link.platform}
                  </span>
                  <span className="text-slate-500 truncate max-w-[180px]">
                    {link.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(link.platform)}
                  className="text-slate-500 hover:text-rose-400 transition-colors ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add new social platform */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Add or Update Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none capitalize"
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
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPlatform}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Icon</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAndClose}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
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
