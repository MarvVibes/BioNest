'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  username: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  profileId,
  username,
}: ReportModalProps) {
  const [reason, setReason] = useState<string>('spam_or_phishing');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profileId,
          reason,
          details: details.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-[#E5E5E3] rounded-[32px] p-6 shadow-2xl text-[#191919]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E5E3]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-[#191919]">Report @{username}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-[#1E392A] rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#191919]">Report Received</h4>
            <p className="text-xs text-[#71716E] leading-relaxed">
              Your report has been submitted for review. We take safety and trust very seriously.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 py-2 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-xs font-bold text-white shadow-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {errorMsg}
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] text-xs font-medium text-[#191919] outline-none"
              >
                <option value="spam_or_phishing">Spam or Phishing</option>
                <option value="scam_or_fraud">Scam, Fraud or Deceptive</option>
                <option value="impersonation">Impersonation</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1.5">
                Details (optional)
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this page violates policies..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D8D8D5] text-xs text-[#191919] outline-none resize-none font-medium placeholder:text-[#B5B5B0]"
              />
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full bg-[#F3F3F1] hover:bg-[#EAEAE8] text-[#71716E] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
