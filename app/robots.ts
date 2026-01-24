import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pornhub1.fun' // Replace with actual production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/'],
    },
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/video-sitemap.xml`],
  }
}
