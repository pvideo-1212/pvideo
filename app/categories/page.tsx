import { Metadata } from 'next'
import CategoriesClient, { Category } from './CategoriesClient'

export const metadata: Metadata = {
  title: 'Browse Categories - All Video Categories',
  description: 'Browse all video categories on TubeX. Find videos by category including Indian, Japanese, Asian, MILF, Teen, Amateur, and more. Free HD streaming.',
  keywords: [
    'video categories', 'browse categories', 'category list', 'video genres',
    'indian videos', 'japanese videos', 'asian videos', 'milf videos',
    'teen videos', 'amateur videos', 'hd categories', 'free categories',
    'adult categories', 'content categories'
  ],
  openGraph: {
    type: 'website',
    title: 'Browse Categories - TubeX',
    description: 'Browse all video categories. Find exactly what you\'re looking for.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Categories - TubeX',
    description: 'Browse all video categories on TubeX.',
  },
}

// Static categories data
const categories: Category[] = [
  { name: 'Indian', slug: 'indian', count: 1250 },
  { name: 'Japanese', slug: 'japanese', count: 3400 },
  { name: 'Asian', slug: 'asian', count: 5600 },
  { name: 'MILF', slug: 'milf', count: 8900 },
  { name: 'Teen', slug: 'teen', count: 6700 },
  { name: 'Big Tits', slug: 'big-tits', count: 4500 },
  { name: 'Amateur', slug: 'amateur', count: 7200 },
  { name: 'Anal', slug: 'anal', count: 3800 },
  { name: 'Lesbian', slug: 'lesbian', count: 2900 },
  { name: 'Blonde', slug: 'blonde', count: 4100 },
  { name: 'Brunette', slug: 'brunette', count: 3300 },
  { name: 'Hardcore', slug: 'hardcore', count: 5200 },
  { name: 'Creampie', slug: 'creampie', count: 4600 },
  { name: 'POV', slug: 'pov', count: 3100 },
  { name: 'Blowjob', slug: 'blowjob', count: 5800 },
  { name: 'Big Ass', slug: 'big-ass', count: 4200 },
  { name: 'Threesome', slug: 'threesome', count: 2400 },
  { name: 'Massage', slug: 'massage', count: 1800 },
  { name: 'Interracial', slug: 'interracial', count: 3600 },
  { name: 'Cumshot', slug: 'cumshot', count: 4900 },
  { name: 'Hentai', slug: 'hentai', count: 1500 },
  { name: 'VR', slug: 'vr', count: 800 },
  { name: 'Bungul', slug: 'bungul', count: 120 },
  { name: 'Desi', slug: 'desi', count: 2100 },
]

// BreadcrumbList Schema for better SEO
function BreadcrumbSchema() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://pornhub1.fun'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://pornhub1.fun/categories'
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
    />
  )
}

export default function CategoriesPage() {
  return (
    <>
      <BreadcrumbSchema />
      <CategoriesClient categories={categories} />
    </>
  )
}
