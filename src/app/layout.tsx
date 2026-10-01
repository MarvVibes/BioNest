import type { Metadata } from 'next';
import {
  Inter,
  Outfit,
  Space_Grotesk,
  Plus_Jakarta_Sans,
  Playfair_Display,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BioNest — The Clean Link-in-Bio for Modern Creators & Businesses',
  description:
    'One link for your entire world. No BioNest branding on free pages, rich analytics, WhatsApp & phone integration, and link scheduling.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'BioNest — One link for your entire digital world',
    description:
      'Claim your unique link-in-bio page. Unbranded, lightning-fast on mobile, with direct WhatsApp and phone contact channels.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#090d16] text-[#f8fafc] selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
