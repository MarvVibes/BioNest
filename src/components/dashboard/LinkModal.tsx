'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  Heading,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { LinkType, linkFormSchema } from '@/lib/validation';
import { BioLink } from './PhonePreview';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkToEdit?: BioLink | null;
  onSave: (data: Partial<BioLink>) => Promise<void>;
}

export default function LinkModal({
  isOpen,
  onClose,
  linkToEdit,
  onSave,
}: LinkModalProps) {
  const [type, setType] = useState<LinkType>('standard');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showFrom, setShowFrom] = useState('');
  const [showUntil, setShowUntil] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (linkToEdit) {
      setType(linkToEdit.type || 'standard');
      setTitle(linkToEdit.title || '');
      setUrl(linkToEdit.url || '');
      setWhatsappNumber(linkToEdit.whatsapp_number || '');
      setMessage(linkToEdit.message || '');
      setShowFrom(
        linkToEdit.show_from
          ? new Date(linkToEdit.show_from).toISOString().slice(0, 16)
          : ''
      );
      setShowUntil(
        linkToEdit.show_until
          ? new Date(linkToEdit.show_until).toISOString().slice(0, 16)
          : ''
      );
    } else {
      setType('standard');
      setTitle('');
      setUrl('');
      setWhatsappNumber('');
      setMessage('');
      setShowFrom('');
      setShowUntil('');
    }
    setErrorMsg('');
  }, [linkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-format inputs
    let formattedUrl = url.trim();
    if (type === 'standard' && formattedUrl && !formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const payload = {
      type,
      title: title.trim(),
      url: type === 'standard' || type === 'phone' || type === 'email' ? formattedUrl : null,
      whatsapp_number: type === 'whatsapp' ? whatsappNumber.trim() : null,
      message: type === 'whatsapp' ? message.trim() : null,
      show_from: showFrom ? new Date(showFrom).toISOString() : null,
      show_until: showUntil ? new Date(showUntil).toISOString() : null,
    };

    // Validate using Zod schema
    const validation = linkFormSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please verify form fields');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...payload,
        id: linkToEdit?.id,
        is_active: linkToEdit ? linkToEdit.is_active : true,
      });
      onClose();
    } catch {
      setErrorMsg('Failed to save link. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-[#E5E5E3] rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E3]">
          <h3 className="text-lg font-bold text-[#191919] tracking-tight">
            {linkToEdit ? 'Edit Link' : 'Add New Link'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Link Type Selector Tabs */}
        {!linkToEdit && (
          <div className="grid grid-cols-5 gap-1 mb-6 p-1 rounded-2xl bg-[#F3F3F1] border border-[#E5E5E3]">
            <button
              type="button"
              onClick={() => {
                setType('standard');
                if (!title) setTitle('Visit Website');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                type === 'standard'
                  ? 'bg-white text-[#191919] shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('whatsapp');
                if (!title) setTitle('Order on WhatsApp');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                type === 'whatsapp'
                  ? 'bg-[#25D366] text-white shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('phone');
                if (!title) setTitle('Call Directly');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                type === 'phone'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('email');
                if (!title) setTitle('Send Email');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                type === 'email'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('header');
                if (!title) setTitle('Featured Section');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                type === 'header'
                  ? 'bg-[#1E2330] text-white shadow-xs'
                  : 'text-[#71716E] hover:text-[#191919]'
              }`}
            >
              <Heading className="w-3.5 h-3.5" />
              <span>Header</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5">
              {type === 'header' ? 'Section Header Title' : 'Button Label Text'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'header' ? 'e.g. Featured Music' : 'e.g. My Online Store'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-sm font-medium"
            />
          </div>

          {/* Standard Link */}
          {type === 'standard' && (
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">
                Destination URL
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/store"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-sm font-medium"
              />
            </div>
          )}

          {/* WhatsApp Link Inputs */}
          {type === 'whatsapp' && (
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+2348012345678"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 focus:border-emerald-600 outline-none text-emerald-950 text-sm font-mono"
                />
                <p className="text-[11px] text-emerald-700 mt-1">
                  Example: 2348012345678 or +2348012345678 (no spaces or dashes)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">
                  Prefilled Chat Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I want to place an order from your BioNest page."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 focus:border-emerald-600 outline-none text-emerald-950 text-xs resize-none"
                />
              </div>
            </div>
          )}

          {/* Phone Link */}
          {type === 'phone' && (
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">
                Phone Number to Call
              </label>
              <input
                type="tel"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-sm font-mono"
              />
            </div>
          )}

          {/* Email Link */}
          {type === 'email' && (
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">
                Contact Email Address
              </label>
              <input
                type="email"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contact@yourdomain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] focus:border-[#1E392A] outline-none text-[#191919] text-sm"
              />
            </div>
          )}

          {/* Scheduling Section (PRD Requirement) */}
          <div className="pt-2 border-t border-[#E5E5E3]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#191919] mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#1E392A]" />
              <span>Link Scheduling (Optional)</span>
            </div>
            <p className="text-[11px] text-[#71716E] mb-3">
              Automatically make this link visible during a limited time window (e.g. ticket drop, promo).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#71716E] mb-1">
                  Show From
                </label>
                <input
                  type="datetime-local"
                  value={showFrom}
                  onChange={(e) => setShowFrom(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] text-[#191919] text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#71716E] mb-1">
                  Show Until
                </label>
                <input
                  type="datetime-local"
                  value={showUntil}
                  onChange={(e) => setShowUntil(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] text-[#191919] text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E3]">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-full text-xs font-semibold text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{linkToEdit ? 'Save Changes' : 'Add Link'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
