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
      title: `${query} - TubeX Search`,
      description: `Watch ${query} videos on TubeX. Free HD streaming. Page ${page}.`,
      robots: 'noindex, follow', // Typically search results shouldn't be indexed to avoid spam
    }
  }

  return {
    title: 'TubeX - Premium Free HD Video Streaming',
    description: 'Watch millions of free HD videos on TubeX. No registration required. High quality, fast streaming.',
    openGraph: {
      type: 'website',
      title: 'TubeX - Premium Free HD Video Streaming',
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
