import React from 'react'

export interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[]
  id?: string
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data, id = 'structured-data-jsonld' }) => {
  const jsonContent = JSON.stringify(data)

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonContent }}
    />
  )
}

/**
 * Pre-configured Schema.org Entities for ShadowCast
 */
export const SHADOWCAST_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ShadowCast',
  legalName: 'DEGiTEX Technologies',
  url: 'https://shadowcast.in',
  logo: 'https://shadowcast.in/favicon.svg',
  image: 'https://shadowcast.in/og-image.png',
  description:
    'DEGiTEX Technologies develops ShadowCast, a high-performance Windows screen mirroring and streaming platform with ultra low latency and hardware NVENC encoding.',
}

export const SHADOWCAST_WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShadowCast',
  url: 'https://shadowcast.in',
  description: 'Ultra Low-Latency Screen Mirroring for Windows',
  publisher: {
    '@type': 'Organization',
    name: 'ShadowCast',
    url: 'https://shadowcast.in',
  },
}

export const SHADOWCAST_SOFTWARE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ShadowCast',
  operatingSystem: 'Windows 10, Windows 11 (x64)',
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'Screen Mirroring & Streaming',
  url: 'https://shadowcast.in',
  image: 'https://shadowcast.in/og-image.png',
  softwareVersion: '1.8.5',
  description:
    'ShadowCast is a low-latency (0.8ms) screen mirroring host application for Windows. Supports wireless AirPlay 2 and USB Scrcpy from iOS and Android devices at up to 4K 120FPS with NVENC acceleration.',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      name: 'Creator Edition',
      description: '1080p 60FPS screen mirroring with 1 paired device',
    },
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      name: 'Creator Pro',
      description: '4K 120FPS screen mirroring, 5 paired devices, and NVENC AV1 encoding',
    },
  ],
  featureList: [
    'Sub-millisecond pipeline latency (0.8ms)',
    '4K UHD 120FPS ultra-smooth streaming',
    'NVENC AV1 and QuickSync hardware decoding',
    'Wireless AirPlay 2 receiver for iPhone and iPad',
    'Low-latency USB mirroring for Android',
    'Lossless 320kbps Opus Studio audio capture',
  ],
}

export const SHADOWCAST_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Shadow Cast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shadow Cast is a Windows application for screen mirroring from supported devices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which devices are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Android and iPhone devices, connected wirelessly or via USB where supported.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does wireless mirroring work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Devices are discovered on the network and connected using supported workflows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I connect using USB?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, where the device and driver support it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it support iPhone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, iPhone is supported via wireless and USB where available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it support Android?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Android is supported via wireless and USB where available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I record my screen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Screen recording functionality is included where implemented.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if a device is not detected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the troubleshooting and diagnostics tools in the app.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the system requirements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Windows 10/11 (x64). Additional requirements depend on features used.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install Shadow Cast?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run the installer when available and follow the setup wizard.',
      },
    },
  ],
}

