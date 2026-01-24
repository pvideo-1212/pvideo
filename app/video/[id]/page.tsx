import { Suspense } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { scrapeVideoDetails } from '@/lib/scraper/scraper'
import VideoClient from './VideoClient'
import { Loader2 } from 'lucide-react'

// Force dynamic rendering to handle caching manually and avoid static generation errors
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate SEO Metadata dynamically
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params

  // Scrape video details on server
  const video = await scrapeVideoDetails(id)

  if (!video) {
    return {
      title: 'Video Not Found - TubeX',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${video.title} - TubeX`,
    description: video.description || `Watch ${video.title} on TubeX. Free HD streaming.`,
    openGraph: {
      title: video.title,
      description: video.description,
      images: [
        video.thumbnail,
        ...previousImages
      ],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.description,
      images: [video.thumbnail],
    },
  }
}

// Helper to convert "MM:SS" or "HH:MM:SS" to ISO 8601 "PT#H#M#S"
function formatDuration(duration: string): string {
  if (!duration) return 'PT0S'
  const parts = duration.split(':').map(Number)
  if (parts.length === 3) {
    return `PT${parts[0]}H${parts[1]}M${parts[2]}S`
  }
  if (parts.length === 2) {
    return `PT${parts[0]}M${parts[1]}S`
  }
  return 'PT0S'
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params

  // Server-side fetching
  const video = await scrapeVideoDetails(id)

  if (!video) {
    notFound()
  }

  // Construct JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || `Watch ${video.title} on TubeX`,
    thumbnailUrl: [video.thumbnail],
    uploadDate: new Date().toISOString(), // Fallback since we don't scrape exact date
    duration: formatDuration(video.duration),
    contentUrl: video.url || `https://pornhub1.fun/video/${id}`,
    embedUrl: video.url || `https://pornhub1.fun/video/${id}`,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: parseInt(video.views?.replace(/,/g, '') || '0', 10)
    }
  }

  // BreadcrumbList Schema
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
        name: 'Videos',
        item: 'https://pornhub1.fun/videos'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: video.title,
        item: `https://pornhub1.fun/video/${id}`
      }
    ]
  }

  // Combine schemas
  const schemas = [jsonLd, breadcrumbLd]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      }>
        <VideoClient initialVideo={video} />
      </Suspense>
    </>
  )
}
