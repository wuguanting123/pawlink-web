import { ZoneType } from '../types/pawlink';

export interface ZoneTheme {
  zone: ZoneType;
  label: string;
  badgePrefix: string;
  // Navbar
  navBg: string;
  navBorder: string;
  navBrandBg: string;
  navBrandText: string;
  navActivePill: string;
  navAccountBtn: string;
  // Accent & Buttons
  accentStripe: string;
  primaryBg: string;
  primaryText: string;
  ctaBg: string;
  ctaHoverBg: string;
  ctaText: string;
  softBg: string;
  softBorder: string;
  softText: string;
  // Floating UI Badge
  uiBadgeBg: string;
  uiBadgeText: string;
  uiBadgeBorder: string;
}

export const ZONE_THEMES: Record<ZoneType, ZoneTheme> = {
  portal: {
    zone: 'portal',
    label: '共用入口',
    badgePrefix: 'UI-01',
    navBg: 'bg-[#0F2B36]',
    navBorder: 'border-[#1B4252]',
    navBrandBg: 'bg-white/15',
    navBrandText: 'text-white',
    navActivePill: 'bg-white/20 text-white',
    navAccountBtn: 'bg-[#163D4C] hover:bg-[#1E5063] text-white border border-white/20',
    accentStripe: 'bg-[#0F2B36]',
    primaryBg: 'bg-[#0F2B36]',
    primaryText: 'text-[#0F2B36]',
    ctaBg: 'bg-[#0F2B36]',
    ctaHoverBg: 'hover:bg-[#163D4C]',
    ctaText: 'text-white',
    softBg: 'bg-slate-100',
    softBorder: 'border-slate-300',
    softText: 'text-slate-900',
    uiBadgeBg: 'bg-white',
    uiBadgeText: 'text-[#0F2B36]',
    uiBadgeBorder: 'border-slate-300',
  },
  adopt: {
    zone: 'adopt',
    label: '領養專區',
    badgePrefix: 'UI-02',
    // UI-00.01: #F57C00 main color; bright orange uses dark text for high contrast; important CTA uses deep orange #B45309 + white text
    navBg: 'bg-[#9A4100]',
    navBorder: 'border-[#7C3400]',
    navBrandBg: 'bg-[#F57C00]',
    navBrandText: 'text-slate-950',
    navActivePill: 'bg-[#F57C00] text-slate-950 font-bold',
    navAccountBtn: 'bg-[#F57C00] hover:bg-[#FB8C00] text-slate-950 font-bold shadow-sm',
    accentStripe: 'bg-[#F57C00]',
    primaryBg: 'bg-[#F57C00]',
    primaryText: 'text-[#B45309]',
    ctaBg: 'bg-[#B45309]',
    ctaHoverBg: 'hover:bg-[#92400E]',
    ctaText: 'text-white',
    softBg: 'bg-[#FFF3E0]',
    softBorder: 'border-[#F57C00]/40',
    softText: 'text-[#7C2D12]',
    uiBadgeBg: 'bg-[#F57C00]',
    uiBadgeText: 'text-slate-950',
    uiBadgeBorder: 'border-[#B45309]',
  },
  care: {
    zone: 'care',
    label: '飼主追蹤',
    badgePrefix: 'UI-03',
    // UI-00.01: #1565C0 blue system
    navBg: 'bg-[#0D3C78]',
    navBorder: 'border-[#092B57]',
    navBrandBg: 'bg-[#1565C0]',
    navBrandText: 'text-white',
    navActivePill: 'bg-[#1565C0] text-white font-bold',
    navAccountBtn: 'bg-[#1565C0] hover:bg-[#1976D2] text-white font-bold shadow-sm',
    accentStripe: 'bg-[#1565C0]',
    primaryBg: 'bg-[#1565C0]',
    primaryText: 'text-[#1565C0]',
    ctaBg: 'bg-[#0D47A1]',
    ctaHoverBg: 'hover:bg-[#093375]',
    ctaText: 'text-white',
    softBg: 'bg-[#EEF4FF]',
    softBorder: 'border-[#1565C0]/30',
    softText: 'text-[#0D3C78]',
    uiBadgeBg: 'bg-[#1565C0]',
    uiBadgeText: 'text-white',
    uiBadgeBorder: 'border-[#0D47A1]',
  },
  org: {
    zone: 'org',
    label: '機構管理',
    badgePrefix: 'UI-04',
    // UI-00.01: #0F6B5B forest teal system
    navBg: 'bg-[#0A4D41]',
    navBorder: 'border-[#07382F]',
    navBrandBg: 'bg-[#0F6B5B]',
    navBrandText: 'text-white',
    navActivePill: 'bg-[#0F6B5B] text-white font-bold',
    navAccountBtn: 'bg-[#0F6B5B] hover:bg-[#12806D] text-white font-bold shadow-sm',
    accentStripe: 'bg-[#0F6B5B]',
    primaryBg: 'bg-[#0F6B5B]',
    primaryText: 'text-[#0F6B5B]',
    ctaBg: 'bg-[#0F6B5B]',
    ctaHoverBg: 'hover:bg-[#0A4D41]',
    ctaText: 'text-white',
    softBg: 'bg-[#E6F4F1]',
    softBorder: 'border-[#0F6B5B]/30',
    softText: 'text-[#07382F]',
    uiBadgeBg: 'bg-[#0F6B5B]',
    uiBadgeText: 'text-white',
    uiBadgeBorder: 'border-[#07382F]',
  },
  system: {
    zone: 'system',
    label: '設計與架構',
    badgePrefix: 'UI-00',
    navBg: 'bg-[#0A4D41]',
    navBorder: 'border-[#07382F]',
    navBrandBg: 'bg-[#0F6B5B]',
    navBrandText: 'text-white',
    navActivePill: 'bg-[#0F6B5B] text-white font-bold',
    navAccountBtn: 'bg-[#0F6B5B] hover:bg-[#12806D] text-white font-bold',
    accentStripe: 'bg-[#0F6B5B]',
    primaryBg: 'bg-[#0F6B5B]',
    primaryText: 'text-[#0F6B5B]',
    ctaBg: 'bg-[#0F6B5B]',
    ctaHoverBg: 'hover:bg-[#0A4D41]',
    ctaText: 'text-white',
    softBg: 'bg-slate-100',
    softBorder: 'border-slate-300',
    softText: 'text-slate-900',
    uiBadgeBg: 'bg-[#0F6B5B]',
    uiBadgeText: 'text-white',
    uiBadgeBorder: 'border-[#07382F]',
  },
};

export function getZoneFromPathname(pathname: string): ZoneType {
  if (pathname.startsWith('/adopt')) return 'adopt';
  if (pathname.startsWith('/care')) return 'care';
  if (pathname.startsWith('/organization')) return 'org';
  if (
    pathname.startsWith('/design-system') ||
    pathname.startsWith('/overview') ||
    pathname.startsWith('/flows') ||
    pathname.startsWith('/rules') ||
    pathname.startsWith('/ui-flow')
  ) {
    return 'system';
  }
  return 'portal';
}
