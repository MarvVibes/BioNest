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
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save link');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">
            {linkToEdit ? 'Edit Link' : 'Add New Link'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Link Type Selector Tabs */}
        {!linkToEdit && (
          <div className="grid grid-cols-5 gap-1.5 mb-5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('standard');
                if (!title) setTitle('Visit Website');
              }}
              className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                type === 'standard'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('whatsapp');
                if (!title) setTitle('Chat on WhatsApp');
              }}
              className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                type === 'whatsapp'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('phone');
                if (!title) setTitle('Call Us Directly');
              }}
              className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                type === 'phone'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>Phone</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('email');
                if (!title) setTitle('Send Email');
              }}
              className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                type === 'email'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('header');
                if (!title) setTitle('Featured Projects');
              }}
              className={`py-2 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                type === 'header'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heading className="w-3.5 h-3.5 text-purple-400" />
              <span>Header</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {type === 'header' ? 'Header Text' : 'Button Label'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'header' ? 'Section Header' : 'e.g. My Online Store'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
            />
          </div>

          {/* Standard Link */}
          {type === 'standard' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Destination URL
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/store"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Must start with http:// or https:// (unsafe schemes are blocked).
              </p>
            </div>
          )}

          {/* WhatsApp Link */}
          {type === 'whatsapp' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+2348012345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Prefilled WhatsApp Message (optional)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello, I saw your BioNest page and would like to order..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
                />
              </div>
            </>
          )}

          {/* Phone Link */}
          {type === 'phone' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Phone Number (starts tel: call)
              </label>
              <input
                type="tel"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="+2348012345678"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm font-mono"
              />
            </div>
          )}

          {/* Email Link */}
          {type === 'email' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address (starts mailto:)
              </label>
              <input
                type="email"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="contact@business.ng"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-sm"
              />
            </div>
          )}

          {/* Scheduling Section */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-slate-200">
                Link Scheduling (Optional)
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Show From
                </label>
                <input
                  type="datetime-local"
                  value={showFrom}
                  onChange={(e) => setShowFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Show Until
                </label>
                <input
                  type="datetime-local"
                  value={showUntil}
                  onChange={(e) => setShowUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 outline-none text-slate-200 text-xs"
                />
              </div>
            </div>
            {(showFrom || showUntil) && (
              <button
                type="button"
                onClick={() => {
                  setShowFrom('');
                  setShowUntil('');
                }}
                className="text-[11px] text-slate-400 hover:text-rose-400 mt-2 transition-colors"
              >
                Clear scheduling
              </button>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>{linkToEdit ? 'Save Changes' : 'Add Link'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
