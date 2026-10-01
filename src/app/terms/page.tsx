import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — BioNest',
  description: 'Terms of Service and acceptable use policy for BioNest.',
};

export default function TermsPage() {
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
        {/* Lawyer Review Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            <strong>Notice:</strong> This is a draft terms of service document marked for legal and regulatory review prior to commercial launch in accordance with local laws in Nigeria and applicable African jurisdictions.
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#71716E] mt-1 font-medium">Last updated: October 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-[#575753] leading-relaxed">
          <h2 className="text-base font-bold text-[#191919]">1. Acceptance of Terms</h2>
          <p>
            By creating an account, claiming a username, or using BioNest (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
          </p>

          <h2 className="text-base font-bold text-[#191919]">2. User Account and Security</h2>
          <p>
            You must provide accurate and verifiable information upon registration. You are responsible for safeguarding your password and account credentials. BioNest reserves the right to reclaim or reassign usernames that violate trademark rights or are held by inactive squatters.
          </p>

          <h2 className="text-base font-bold text-[#191919]">3. Acceptable Use and Prohibited Content</h2>
          <p>
            You agree not to use BioNest to publish or link to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[#71716E]">
            <li>Phishing, credential harvesting, or financial scam operations.</li>
            <li>Malicious code, spyware, or harmful software distributions.</li>
            <li>Hate speech, harassment, defamation, or violent extremism.</li>
            <li>Unlawful substances, unlicensed medical services, or illegal gambling.</li>
          </ul>

          <h2 className="text-base font-bold text-[#191919]">4. Content Ownership</h2>
          <p>
            You retain full intellectual property ownership of all titles, logos, avatars, and media you upload to your BioNest page. You grant BioNest a non-exclusive license solely to host and display your page across the internet.
          </p>

          <h2 className="text-base font-bold text-[#191919]">5. Termination and Abuse Moderation</h2>
          <p>
            BioNest reserves the right to suspend, disable, or delete any profile or link reported and verified to violate these terms without prior notice.
          </p>

          <h2 className="text-base font-bold text-[#191919]">6. Contact Information</h2>
          <p>
            For legal inquiries or trademark infringement notices, contact us at{' '}
            <a href="mailto:legal@bionest.link" className="text-[#1E392A] font-semibold underline">
              legal@bionest.link
            </a>.
          </p>
        </section>
      </main>
    </div>
  );
}
