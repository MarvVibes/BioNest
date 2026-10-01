import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/25 mb-6">
        <Sparkles className="w-7 h-7 text-black stroke-[2.5]" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        The BioNest page you are looking for doesn&apos;t exist or may have been claimed by another creator.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/signup"
          className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <span>Claim this username</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
