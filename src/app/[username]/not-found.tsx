import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3F3F1] text-[#191919] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#1E392A] text-[#D2E823] flex items-center justify-center font-black text-2xl shadow-xs mb-6">
        B
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-[#191919] mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-[#71716E] max-w-sm mb-6 leading-relaxed">
        The BioNest page you are looking for doesn&apos;t exist or may have been updated.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="py-3 px-6 rounded-full bg-white border border-[#D8D8D5] hover:bg-[#FAF9F5] text-[#191919] text-xs font-semibold transition-colors shadow-xs"
        >
          Go to Homepage
        </Link>
        <Link
          href="/signup"
          className="py-3 px-6 rounded-full bg-[#1E392A] hover:bg-[#14261C] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <span>Claim your link</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
