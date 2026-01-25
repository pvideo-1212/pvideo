import { Suspense } from 'react'
import { Metadata } from 'next'
// Playwright scraper - works on Railway (Docker support)
import { scrapeVideoList, scrapeSearch } from '@/lib/scraper/scraper'
import HomeClient from './HomeClient'
import { Loader2 } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : undefined
  const page = typeof params.page === 'string' ? params.page : '1'

  if (query) {
    return {
      title: `${query} - Search Results`,
      description: `Watch ${query} videos on TubeX. Free HD streaming. Page ${page}.`,
      keywords: [query, 'search', 'videos', 'HD', 'free streaming', 'watch online'],
      robots: 'noindex, follow',
    }
  }

  return {
    title: 'TubeX - Premium Free HD Video Streaming',
    description: 'Watch millions of free HD videos on TubeX. No registration required. High quality, fast streaming, and daily updates.',
    keywords: [
      'free videos', 'HD streaming', '4K videos', 'online videos', 'watch free',
      'video platform', 'daily updates', 'streaming site', 'video streaming',
      'adult entertainment', 'free streaming', 'HD quality', 'amateur videos',
      'professional videos', 'video categories', 'pornstars', 'channels'
    ],
    openGraph: {
      type: 'website',
      title: 'TubeX - Premium Free HD Video Streaming',
      description: 'Watch millions of free HD videos. No registration required.',
      images: ['/og-image.png'],
      siteName: 'TubeX',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TubeX - Premium Free HD Video Streaming',
      description: 'Watch millions of free HD videos. No registration required.',
      images: ['/og-image.png'],
    },
  }
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams
  const currentPage = parseInt((typeof params.page === 'string' ? params.page : '1'), 10)
  const searchQuery = typeof params.q === 'string' ? params.q : ''

  // Server-side fetching
  let data
  if (searchQuery) {
    data = await scrapeSearch(searchQuery, currentPage)
  } else {
    data = await scrapeVideoList(currentPage)
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <HomeClient
        initialVideos={data?.items || []}
        initialHasMore={data?.hasMore || false}
      />
    </Suspense>
  )
}
