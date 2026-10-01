# BioNest — Link-in-Bio Platform for African Creators & Businesses

> One link for your entire digital world. Free unbranded bio pages, real analytics, native WhatsApp & phone links, and automatic link scheduling.

---

## 🌟 Key Differentiators

1. **Zero BioNest Branding on Free Pages**: Unlike Linktree, free users get a completely unbranded, clean page. Your brand belongs to you.
2. **Actionable Free Analytics**: Real page views, link clicks, click-through rates (CTR), top links, referring channels (Instagram, TikTok, WhatsApp, X, Facebook, YouTube, Direct), geographic countries, and devices.
3. **Built-in WhatsApp & Phone Buttons**: Native support for `wa.me` links with customizable prefilled messages and direct `tel:` calls where local commerce actually happens.
4. **Link Scheduling**: Set `show_from` and `show_until` windows in UTC so promotions and campaigns appear and expire automatically.
5. **Ultra-Lightweight & Fast**: Server-rendered public pages under 100 KB payload designed for fast loading on 3G connections.
6. **Privacy-Centric Architecture**: Strict adherence to the Nigeria Data Protection Act (NDPA). No raw IP addresses stored; daily-rotating SHA-256 visitor hash prevents tracking while counting unique visits.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with self-hosted Google Fonts (`Inter`, `Outfit`, `Space Grotesk`, `Plus Jakarta Sans`, `Playfair Display`)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Auth, Storage)
- **Libraries**:
  - `@dnd-kit/core`, `@dnd-kit/sortable` (drag-and-drop link reordering)
  - `recharts` (analytics time-series curves)
  - `qrcode` (high-res PNG and vector SVG downloads)
  - `zod` (validation on client and server)
  - `lucide-react` + inline SVGs (responsive icons)
  - `vitest` (automated unit testing)

---

## 📂 Project Structure

```tree
BioNest/
├── supabase/
│   └── migrations/
│       └── 20261001_init.sql         # Supabase SQL schema, RLS, triggers, storage
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Email/password + Google auth
│   │   │   ├── signup/page.tsx       # Sign up with email confirmation flow
│   │   │   ├── reset-password/page.tsx # Password recovery
│   │   │   └── auth/callback/route.ts# Supabase session exchanger
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx            # Dashboard shell, header, tabs, QR modal
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Links editor + live phone preview
│   │   │   │   ├── appearance/page.tsx # 8 curated themes + custom controls
│   │   │   │   ├── analytics/page.tsx  # Real event metrics & charts
│   │   │   │   └── settings/page.tsx   # Profile info, username, account deletion
│   │   ├── onboarding/
│   │   │   └── page.tsx              # Username claim & initial setup wizard
│   │   ├── go/
│   │   │   └── [linkId]/route.ts     # Failsafe 302 click redirect route
│   │   ├── api/
│   │   │   ├── check-username/route.ts # Live debounced username validator
│   │   │   └── report/route.ts       # Abuse report submissions
│   │   ├── terms/page.tsx            # Terms of Service (marked for lawyer review)
│   │   ├── privacy/page.tsx          # NDPA-compliant Privacy Notice
│   │   ├── [username]/
│   │   │   ├── page.tsx              # Ultra-fast server-rendered public bio page
│   │   │   └── not-found.tsx         # Custom 404 page for unclaimed handles
│   │   ├── page.tsx                  # Marketing Landing Page
│   │   ├── layout.tsx                # Root layout & self-hosted fonts
│   │   └── globals.css               # Design system tokens & utility styles
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── LinkEditor.tsx / LinkItem.tsx # Draggable sortable link cards
│   │   │   ├── LinkModal.tsx         # Add/edit links of all 5 types + scheduling
│   │   │   ├── ProfileHeaderEditor.tsx # Avatar compression & inline bio editor
│   │   │   ├── SocialLinksModal.tsx  # 11 supported social platforms
│   │   │   ├── PhonePreview.tsx      # Realistic smartphone preview
│   │   │   └── QRCodeModal.tsx       # PNG & SVG QR generator
│   │   ├── analytics/
│   │   │   ├── StatsOverview.tsx     # Views, clicks, CTR cards
│   │   │   ├── TimeseriesChart.tsx   # Recharts view/click daily performance
│   │   │   ├── TopLinksTable.tsx     # Click counts per link
│   │   │   └── BreakdownCards.tsx    # Country, Referrer, Device breakdown
│   │   ├── public/
│   │   │   ├── PublicBioView.tsx     # Public bio page UI
│   │   │   └── ReportModal.tsx       # Abuse reporting modal
│   │   └── ui/
│   │       └── SocialIcons.tsx       # Pure SVG social media icons
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client (cookies)
│   │   │   ├── admin.ts              # Service role client (events & reports)
│   │   │   └── middleware.ts         # Session refresh & protected routes
│   │   ├── validation.ts             # Zod validation schemas
│   │   ├── analytics-helpers.ts      # Bot filtering, referrer mapping, visitor hashing
│   │   ├── themes.ts                 # 8+ curated themes + styling engine
│   │   └── image-compression.ts      # Client-side avatar resizing & WebP compression
│   ├── middleware.ts                 # Route protection & session handling
│   └── tests/
│       ├── validation.test.ts        # Username & URL validation tests
│       ├── scheduling.test.ts        # Scheduling logic tests
│       └── analytics.test.ts         # Referrer mapping & bot filtering tests
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd BioNest
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
VISITOR_SALT=random-string-used-for-daily-visitor-hash
```

### 3. Run the Supabase Migration
1. Go to your **Supabase Dashboard** > **SQL Editor**.
2. Open the file `supabase/migrations/20261001_init.sql`.
3. Paste the contents into the SQL Editor and click **Run**.
4. This script will:
   - Create tables: `profiles`, `links`, `social_links`, `events`, `reports`
   - Enable Row Level Security (RLS) on all tables with strict access policies
   - Create optimized indexes on `username`, `profile_id`, and `created_at`
   - Set up the public `avatars` storage bucket with user-isolated upload policies

### 4. Configure Supabase Authentication (Google OAuth & Email)
1. In the Supabase Dashboard, navigate to **Authentication** > **Providers**.
2. Enable **Email** (turn on or off email confirmations as preferred for development).
3. Enable **Google** (provide your Google Cloud Client ID and Secret if using Google sign-in).
4. In **Authentication** > **URL Configuration**, add:
   - Site URL: `http://localhost:3000` (or `https://your-domain.vercel.app` in production)
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://your-domain.vercel.app/auth/callback`

### 5. Run Automated Tests
```bash
npm test
```
Runs 27 automated unit tests covering:
- Username regex and reserved word rejection
- Safe URL protocol enforcement (blocks `javascript:`, `data:`, `vbscript:`)
- Phone number international sanitization
- Link scheduling active windows and expiration logic
- Referrer source attribution (Instagram, TikTok, WhatsApp, X, etc.)
- Bot and link preview crawler filtering
- Daily-rotating anonymous visitor hashing

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your BioNest repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g., `https://bionest.vercel.app`)
   - `VISITOR_SALT`
5. Click **Deploy**. Vercel will build and serve your app with automatic edge caching and geographic header routing (`x-vercel-ip-country`).

---

## 📋 Legal Disclaimer

Before official commercial launch:
- Confirm domain availability for `bionest.link` or your chosen domain.
- Have qualified legal counsel review the `/terms` and `/privacy` notices under local Nigerian / African commercial regulations.
