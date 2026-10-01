import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Notice — BioNest',
  description: 'BioNest Privacy Notice adhering to the Nigeria Data Protection Act (NDPA).',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#191919] selection:bg-[#D2E823] selection:text-black">
      <header className="border-b border-[#E5E5E3] px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#71716E] hover:text-[#191919] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to BioNest</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1E392A] text-[#D2E823] font-bold text-xs flex items-center justify-center">
              B
            </div>
            <span className="text-sm font-bold text-[#191919]">BioNest Legal</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            <strong>Notice:</strong> This draft privacy policy is formulated in alignment with the Nigeria Data Protection Act (NDPA) 2023 and is marked for legal counsel review prior to general public release.
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight">Privacy Notice</h1>
          <p className="text-xs text-[#71716E] mt-1 font-medium">Last updated: October 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-[#575753] leading-relaxed">
          <h2 className="text-base font-bold text-[#191919]">1. Principles & Commitment</h2>
          <p>
            BioNest respects your privacy. We are designed from the ground up to minimize data collection. Unlike legacy platforms, BioNest <strong>never sells your data</strong>, never embeds third-party surveillance ad pixels, and <strong>does not store raw IP addresses</strong> of visitors.
          </p>

          <h2 className="text-base font-bold text-[#191919]">2. Data We Collect</h2>
          <p>We collect information in two categories:</p>
          <div className="space-y-2 pl-4">
            <p>
              <strong>A. Account Data:</strong> Email address, encrypted password, username, display name, bio, and profile avatar uploaded by the account owner.
            </p>
            <p>
              <strong>B. Anonymous Event Analytics:</strong> When visitors access your public page or click links, we record: timestamp, country code, referring platform (e.g. WhatsApp, Instagram), and device category (Mobile, Desktop, Tablet). We calculate a <em>daily-rotating one-way cryptographic hash</em> (SHA-256) to count unique visits without saving the visitor&apos;s IP address.
            </p>
          </div>

          <h2 className="text-base font-bold text-[#191919]">3. Legal Basis under NDPA</h2>
          <p>
            Under the Nigeria Data Protection Act (NDPA) 2023, we process personal data under the lawful bases of: (i) Contractual necessity to deliver link hosting services, and (ii) Legitimate interest in preventing fraud, abuse, and automated bot scraping.
          </p>

          <h2 className="text-base font-bold text-[#191919]">4. Data Retention & Deletion</h2>
          <p>
            When you delete your account in Settings, all your personal profile records, links, and associated analytics event rows are permanently erased from our primary database immediately.
          </p>

          <h2 className="text-base font-bold text-[#191919]">5. Contact Our Data Protection Team</h2>
          <p>
            For questions or requests regarding your data rights, contact us at{' '}
            <a href="mailto:privacy@bionest.link" className="text-[#1E392A] font-semibold underline">
              privacy@bionest.link
            </a>.
          </p>
        </section>
      </main>
    </div>
  );
}
