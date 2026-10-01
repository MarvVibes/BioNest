import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — BioNest',
  description: 'Terms of Service and acceptable use policy for BioNest.',
};

export default function TermsPage() {
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
        {/* Lawyer Review Alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <p>
            <strong>Notice:</strong> This is a draft terms of service document marked for legal and regulatory review prior to commercial launch in accordance with local laws in Nigeria and applicable African jurisdictions.
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: October 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By creating an account, claiming a username, or using BioNest (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
          </p>

          <h2 className="text-base font-bold text-white">2. User Account and Security</h2>
          <p>
            You must provide accurate and verifiable information upon registration. You are responsible for safeguarding your password and account credentials. BioNest reserves the right to reclaim or reassign usernames that violate trademark rights or are held by inactive squatters.
          </p>

          <h2 className="text-base font-bold text-white">3. Acceptable Use and Prohibited Content</h2>
          <p>
            You agree not to use BioNest to publish or link to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400">
            <li>Phishing, credential harvesting, or financial scam operations (e.g. 419 advance-fee fraud).</li>
            <li>Malicious code, spyware, or harmful software distributions.</li>
            <li>Hate speech, harassment, defamation, or violent extremism.</li>
            <li>Unlawful substances, unlicensed medical services, or illegal gambling.</li>
          </ul>
          <p>
            BioNest maintains an active abuse reporting mechanism. Accounts found in violation will be terminated immediately and reported to relevant enforcement agencies where appropriate.
          </p>

          <h2 className="text-base font-bold text-white">4. Intellectual Property</h2>
          <p>
            You retain all ownership rights to the content, trademarks, and links you publish on your profile. You grant BioNest a non-exclusive license solely to host and display your content to visitors on your public URL.
          </p>

          <h2 className="text-base font-bold text-white">5. Termination and Data Deletion</h2>
          <p>
            You may terminate your account at any time in your Settings dashboard. Account deletion permanently removes your profile, links, stored avatars, and associated event records from our active databases.
          </p>

          <h2 className="text-base font-bold text-white">6. Limitation of Liability</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. BioNest shall not be liable for any indirect, incidental, or consequential damages resulting from third-party links or service interruptions.
          </p>
        </section>
      </main>
    </div>
  );
}
