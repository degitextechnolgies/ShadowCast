/**
 * ShadowCast Production Technical SEO Configuration
 * Domain: https://shadowcast.in
 */

export interface PageSEOConfig {
  title: string
  description: string
  canonical: string
  robots: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

export const SITE_CONFIG = {
  name: 'ShadowCast',
  legalName: 'DEGiTEX Technologies',
  domain: 'shadowcast.in',
  origin: 'https://shadowcast.in',
  defaultOgImage: 'https://shadowcast.in/og-image.png',
  defaultThemeColor: '#050509',
  locale: 'en_US',
  language: 'en',
  twitterHandle: '@shadowcast_in',
} as const

export const SEO_PAGES: Record<string, PageSEOConfig> = {
  home: {
    title: 'ShadowCast — Ultra Low-Latency Screen Mirroring for Windows',
    description:
      'Experience ultra low-latency (0.8ms) screen mirroring from iPhone, Android, and PC to Windows in up to 4K 120FPS with NVENC hardware acceleration and lossless audio.',
    canonical: 'https://shadowcast.in/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: [
      'screen mirroring',
      'screen mirroring for windows',
      'airplay for windows',
      'scrcpy mirroring',
      'low latency screen cast',
      '4k 120fps streaming',
      'nvenc hardware acceleration',
      'iphone to windows mirroring',
      'android to pc screen mirror',
      'shadowcast',
    ],
    ogTitle: 'ShadowCast — Ultra Low-Latency Screen Mirroring for Windows',
    ogDescription:
      'Stream iPhone, Android, and PC to Windows with 0.8ms pipeline latency and up to 4K 120FPS fidelity. Hardware-accelerated with NVENC AV1.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  login: {
    title: 'Sign In — ShadowCast Pilot Hub',
    description:
      'Sign in to your ShadowCast pilot account to manage hardware pairings, streaming licenses, and low-latency display settings.',
    canonical: 'https://shadowcast.in/login',
    robots: 'noindex, nofollow',
    ogTitle: 'Sign In — ShadowCast Pilot Hub',
    ogDescription: 'Access your ShadowCast pilot account and paired screen mirroring hosts.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  register: {
    title: 'Create Pilot Account — ShadowCast',
    description:
      'Create your ShadowCast account to activate high-performance screen mirroring, multi-device allowance, and hardware NVENC encoding.',
    canonical: 'https://shadowcast.in/register',
    robots: 'noindex, nofollow',
    ogTitle: 'Create Pilot Account — ShadowCast',
    ogDescription: 'Register for ShadowCast to unlock wireless AirPlay 2 and USB Scrcpy screen mirroring.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  forgotPassword: {
    title: 'Reset Password — ShadowCast',
    description: 'Recover access to your ShadowCast pilot account and screen mirroring license tokens.',
    canonical: 'https://shadowcast.in/forgot-password',
    robots: 'noindex, nofollow',
    ogTitle: 'Reset Password — ShadowCast',
    ogDescription: 'Recover your ShadowCast pilot account credentials.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  resetPassword: {
    title: 'Set New Password — ShadowCast',
    description: 'Set a new secure password for your ShadowCast account.',
    canonical: 'https://shadowcast.in/reset-password',
    robots: 'noindex, nofollow',
    ogTitle: 'Set New Password — ShadowCast',
    ogDescription: 'Secure your ShadowCast account with a new password.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  dashboard: {
    title: 'Pilot Hub & Streaming Control — ShadowCast',
    description: 'ShadowCast pilot console for managing active mirroring streams, tokens, and paired clients.',
    canonical: 'https://shadowcast.in/dashboard',
    robots: 'noindex, nofollow',
    ogTitle: 'Pilot Hub — ShadowCast',
    ogDescription: 'Manage your active ShadowCast streaming sessions and licenses.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  admin: {
    title: 'Command Center — ShadowCast Cluster Administration',
    description: 'Secured administrative root terminal for ShadowCast cluster and GPU relay operations.',
    canonical: 'https://shadowcast.in/kyareadmin',
    robots: 'noindex, nofollow',
    ogTitle: 'Command Center — ShadowCast',
    ogDescription: 'Administrator access only.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
  notFound: {
    title: '404 Page Not Found — ShadowCast',
    description: 'The requested resource or page could not be located on the ShadowCast network.',
    canonical: 'https://shadowcast.in/404',
    robots: 'noindex, nofollow',
    ogTitle: '404 Page Not Found — ShadowCast',
    ogDescription: 'Page not found on ShadowCast.',
    ogImage: 'https://shadowcast.in/og-image.png',
    ogType: 'website',
    twitterCard: 'summary',
  },
}

