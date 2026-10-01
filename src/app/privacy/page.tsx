import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Notice — BioNest',
  description: 'BioNest Privacy Notice adhering to the Nigeria Data Protection Act (NDPA).',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <header className="border-b border-slate-800/80 px-4 sm:px-8 py-4 bg-[#070b14]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to BioNest</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-sm font-bold">BioNest Legal</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <p>
            <strong>Notice:</strong> This draft privacy policy is formulated in alignment with the Nigeria Data Protection Act (NDPA) 2023 and is marked for legal counsel review prior to general public release.
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Notice</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: October 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Principles & Commitment</h2>
          <p>
            BioNest respects your privacy. We are designed from the ground up to minimize data collection. Unlike legacy platforms, BioNest <strong>never sells your data</strong>, never embeds third-party surveillance ad pixels, and <strong>does not store raw IP addresses</strong> of visitors.
          </p>

          <h2 className="text-base font-bold text-white">2. Data We Collect</h2>
          <p>We collect information in two categories:</p>
          <div className="space-y-2 pl-4">
            <p>
              <strong>A. Account Data:</strong> Email address, encrypted password, username, display name, bio, and profile avatar uploaded by the account owner.
            </p>
            <p>
              <strong>B. Anonymous Event Analytics:</strong> When visitors access your public page or click links, we record: timestamp, country code, referring platform (e.g. WhatsApp, Instagram), and device category (Mobile, Desktop, Tablet). We calculate a <em>daily-rotating one-way cryptographic hash</em> (SHA-256) to count unique visits without saving the visitor&apos;s IP address.
            </p>
          </div>

          <h2 className="text-base font-bold text-white">3. Legal Basis under NDPA</h2>
          <p>
            Under the Nigeria Data Protection Act (NDPA) 2023, we process personal data under the lawful bases of: (i) Contractual necessity to deliver link hosting services, and (ii) Legitimate interest in preventing fraud, abuse, and automated bot scraping.
          </p>

          <h2 className="text-base font-bold text-white">4. Data Subject Rights & Deletion</h2>
          <p>
            You have the right to request access to, rectification of, or erasure of your data. You can delete your account at any time directly through your dashboard settings. Account deletion completely cascades to all your profiles, links, avatar media, and aggregated analytics records.
          </p>

          <h2 className="text-base font-bold text-white">5. Cookies and Tracking</h2>
          <p>
            We use strictly necessary first-party authentication cookies to keep you logged in to your account dashboard. We do not use third-party advertising cookies or cross-site tracking technologies.
          </p>

          <h2 className="text-base font-bold text-white">6. Contact Data Protection Officer</h2>
          <p>
            For privacy inquiries or data requests, contact our compliance team at <span className="font-mono text-emerald-400">privacy@bionest.link</span>.
          </p>
        </section>
      </main>
    </div>
  );
}
