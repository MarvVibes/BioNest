'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function QRCodeModal({ isOpen, onClose, username }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [svgString, setSvgString] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${username}`
    : `https://bionest.link/${username}`;

  useEffect(() => {
    if (!isOpen || !username) return;

    // Generate Canvas for PNG download
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    }

    // Generate SVG string for vector download
    QRCode.toString(fullUrl, { type: 'svg', margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, string) => {
      if (!err && string) {
        setSvgString(string);
      }
    });
  }, [isOpen, username, fullUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${username}-bionest-qr.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${username}-bionest-qr.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <QrIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-white">Your QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          <p className="text-[11px] text-slate-800 font-mono mt-2 font-medium">
            bionest.link/{username}
          </p>
        </div>

        {/* Copy URL bar */}
        <div className="mt-4 flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="w-full bg-transparent px-2 text-xs text-slate-300 font-mono outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleDownloadPNG}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleDownloadSVG}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
