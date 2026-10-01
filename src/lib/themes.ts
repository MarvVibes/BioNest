export interface ThemeConfig {
  id: string;
  name: string;
  category: string;
  background: string; // CSS background or linear-gradient
  pageTextColor: string;
  cardBackground?: string;
  buttonBg: string;
  buttonTextColor: string;
  buttonBorder?: string;
  buttonShadow?: string;
  buttonRadius: 'rounded-none' | 'rounded-lg' | 'rounded-2xl' | 'rounded-full';
  fontFamily: 'Inter' | 'Outfit' | 'Space Grotesk' | 'Plus Jakarta Sans' | 'Playfair Display';
  bioColor: string;
  badgeBg: string;
}

export const BUILT_IN_THEMES: ThemeConfig[] = [
  {
    id: 'classic_dark',
    name: 'Onyx Midnight',
    category: 'Dark',
    background: '#090d16',
    pageTextColor: '#ffffff',
    bioColor: '#94a3b8',
    cardBackground: '#131b2e',
    buttonBg: '#1e293b',
    buttonTextColor: '#f8fafc',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.08)',
    buttonShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'Inter',
    badgeBg: 'rgba(255, 255, 255, 0.05)',
  },
  {
    id: 'lagos_pulse',
    name: 'Lagos Pulse',
    category: 'Vibrant',
    background: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #022c22 100%)',
    pageTextColor: '#f0fdf4',
    bioColor: '#86efac',
    buttonBg: '#10b981',
    buttonTextColor: '#022c22',
    buttonBorder: 'none',
    buttonShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
    buttonRadius: 'rounded-full',
    fontFamily: 'Plus Jakarta Sans',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'clean_slate',
    name: 'Clean Minimal',
    category: 'Light',
    background: '#f8fafc',
    pageTextColor: '#0f172a',
    bioColor: '#64748b',
    cardBackground: '#ffffff',
    buttonBg: '#ffffff',
    buttonTextColor: '#0f172a',
    buttonBorder: '1px solid #e2e8f0',
    buttonShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'Inter',
    badgeBg: '#f1f5f9',
  },
  {
    id: 'sunset_velvet',
    name: 'Sahara Sunset',
    category: 'Warm',
    background: 'linear-gradient(180deg, #3b0764 0%, #1e1b4b 60%, #0f172a 100%)',
    pageTextColor: '#ffffff',
    bioColor: '#f472b6',
    buttonBg: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
    buttonTextColor: '#ffffff',
    buttonBorder: 'none',
    buttonShadow: '0 6px 18px rgba(236, 72, 153, 0.35)',
    buttonRadius: 'rounded-full',
    fontFamily: 'Outfit',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Indigo',
    category: 'Vibrant',
    background: '#030712',
    pageTextColor: '#ffffff',
    bioColor: '#818cf8',
    buttonBg: '#4f46e5',
    buttonTextColor: '#ffffff',
    buttonBorder: '1px solid #6366f1',
    buttonShadow: '0 0 20px rgba(79, 70, 229, 0.4)',
    buttonRadius: 'rounded-lg',
    fontFamily: 'Space Grotesk',
    badgeBg: 'rgba(79, 70, 229, 0.15)',
  },
  {
    id: 'warm_terracotta',
    name: 'Warm Earth',
    category: 'Earth',
    background: '#fef7ee',
    pageTextColor: '#431407',
    bioColor: '#9a3412',
    buttonBg: '#ea580c',
    buttonTextColor: '#ffffff',
    buttonBorder: 'none',
    buttonShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'Outfit',
    badgeBg: '#ffedd5',
  },
  {
    id: 'editorial_serif',
    name: 'Editorial Luxury',
    category: 'Editorial',
    background: '#18181b',
    pageTextColor: '#fafafa',
    bioColor: '#d4d4d8',
    buttonBg: 'transparent',
    buttonTextColor: '#fafafa',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.3)',
    buttonShadow: 'none',
    buttonRadius: 'rounded-none',
    fontFamily: 'Playfair Display',
    badgeBg: 'rgba(255, 255, 255, 0.05)',
  },
  {
    id: 'aurora_borealis',
    name: 'Aurora Borealis',
    category: 'Gradient',
    background: 'linear-gradient(135deg, #09203f 0%, #537895 100%)',
    pageTextColor: '#ffffff',
    bioColor: '#bae6fd',
    buttonBg: 'rgba(255, 255, 255, 0.12)',
    buttonTextColor: '#ffffff',
    buttonBorder: '1px solid rgba(255, 255, 255, 0.25)',
    buttonShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
    buttonRadius: 'rounded-2xl',
    fontFamily: 'Plus Jakarta Sans',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
  },
];

export const DEFAULT_THEME = BUILT_IN_THEMES[0];
