import React, { useEffect } from 'react'
import { SEO_PAGES, SITE_CONFIG, type PageSEOConfig } from '../config/seo'
import { StructuredData } from './StructuredData'

export interface SEOProps {
  pageKey?: keyof typeof SEO_PAGES
  title?: string
  description?: string
  canonical?: string
  robots?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Helper to update or create a <meta> tag by name or property
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string | undefined) {
  if (!content) return
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Helper to update or create a <link rel="..."> tag
 */
function setLinkTag(rel: string, href: string | undefined) {
  if (!href) return
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export const SEO: React.FC<SEOProps> = ({
  pageKey,
  title: customTitle,
  description: customDescription,
  canonical: customCanonical,
  robots: customRobots,
  keywords: customKeywords,
  ogTitle: customOgTitle,
  ogDescription: customOgDescription,
  ogImage: customOgImage,
  ogType: customOgType,
  twitterCard: customTwitterCard,
  structuredData,
}) => {
  const baseConfig: PageSEOConfig = (pageKey && SEO_PAGES[pageKey]) || SEO_PAGES.home

  const finalTitle = customTitle || baseConfig.title
  const finalDescription = customDescription || baseConfig.description
  const finalCanonical = customCanonical || baseConfig.canonical
  const finalRobots = customRobots || baseConfig.robots
  const finalKeywords = customKeywords || baseConfig.keywords
  const finalOgTitle = customOgTitle || baseConfig.ogTitle || finalTitle
  const finalOgDescription = customOgDescription || baseConfig.ogDescription || finalDescription
  const finalOgImage = customOgImage || baseConfig.ogImage || SITE_CONFIG.defaultOgImage
  const finalOgType = customOgType || baseConfig.ogType || 'website'
  const finalTwitterCard = customTwitterCard || baseConfig.twitterCard || 'summary_large_image'

  useEffect(() => {
    // 1. Language declaration
    document.documentElement.lang = SITE_CONFIG.language

    // 2. Document Title
    document.title = finalTitle

    // 3. Standard SEO Meta Tags
    setMetaTag('name', 'description', finalDescription)
    setMetaTag('name', 'robots', finalRobots)
    if (finalKeywords && finalKeywords.length > 0) {
      setMetaTag('name', 'keywords', finalKeywords.join(', '))
    }

    // 4. Canonical URL
    setLinkTag('canonical', finalCanonical)

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:title', finalOgTitle)
    setMetaTag('property', 'og:description', finalOgDescription)
    setMetaTag('property', 'og:image', finalOgImage)
    setMetaTag('property', 'og:url', finalCanonical)
    setMetaTag('property', 'og:type', finalOgType)
    setMetaTag('property', 'og:site_name', SITE_CONFIG.name)
    setMetaTag('property', 'og:locale', SITE_CONFIG.locale)

    // 6. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', finalTwitterCard)
    setMetaTag('name', 'twitter:title', finalOgTitle)
    setMetaTag('name', 'twitter:description', finalOgDescription)
    setMetaTag('name', 'twitter:image', finalOgImage)
    setMetaTag('name', 'twitter:site', SITE_CONFIG.twitterHandle)
  }, [
    finalTitle,
    finalDescription,
    finalCanonical,
    finalRobots,
    finalKeywords,
    finalOgTitle,
    finalOgDescription,
    finalOgImage,
    finalOgType,
    finalTwitterCard,
  ])

  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
    </>
  )
}

export default SEO
