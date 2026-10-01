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
          dark: '#1e392a',
          light: '#ffffff',
        },
      });
    }

    // Generate SVG string for vector download
    QRCode.toString(fullUrl, { type: 'svg', margin: 2, color: { dark: '#1e392a', light: '#ffffff' } }, (err, string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-[#E5E5E3] rounded-[32px] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E3]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E392A] text-[#D2E823] flex items-center justify-center shadow-xs">
              <QrIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#191919]">Your BioNest QR</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#71716E] hover:text-[#191919] hover:bg-[#F3F3F1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5E5E3] flex flex-col items-center justify-center shadow-xs">
          <canvas ref={canvasRef} className="max-w-[200px] h-auto rounded-xl shadow-xs" />
          <p className="text-[11px] text-[#1E392A] font-mono mt-3 font-bold">
            bionest.link/{username}
          </p>
        </div>

        {/* Copy URL bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#FAF9F5] border border-[#D8D8D5]">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="bg-transparent px-3 text-xs text-[#191919] font-mono font-medium outline-none flex-1 truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="py-1.5 px-3 rounded-full bg-white border border-[#D8D8D5] hover:bg-[#F3F3F1] text-[#191919] text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1E392A] stroke-[3]" />
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
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="py-2.5 px-4 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSVG}
            className="py-2.5 px-4 rounded-full bg-white border border-[#D8D8D5] hover:bg-[#FAF9F5] text-[#191919] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
