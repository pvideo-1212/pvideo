import { Suspense } from 'react'
import { Metadata } from 'next'
import { scrapeChannels } from '@/lib/scraper/scraper'
import ChannelsClient from './ChannelsClient'
import { Loader2 } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const page = typeof params.page === 'string' ? params.page : '1'

  return {
    title: `Channels & Studios - Page ${page}`,
    description: `Browse thousands of channels and studios on TubeX. Find content from your favorite producers. Page ${page}.`,
    keywords: [
      'channels', 'studios', 'producers', 'content creators', 'video studios',
      'production companies', 'browse channels', 'studio directory',
      'professional content', 'channel profiles', 'studio videos'
    ],
    openGraph: {
      type: 'website',
      title: 'Channels & Studios - TubeX',
      description: 'Browse thousands of channels and studios.',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Channels & Studios - TubeX',
      description: 'Browse thousands of channels and studios on TubeX.',
      images: ['/og-image.png'],
    },
  }
}

export default async function ChannelsPage({ searchParams }: Props) {
  const params = await searchParams
  const currentPage = parseInt((typeof params.page === 'string' ? params.page : '1'), 10)

  // Server-side fetching
  const data = await scrapeChannels(currentPage)

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ChannelsClient
        initialChannels={data?.items || []}
        initialHasMore={data?.hasMore || false}
      />
    </Suspense>
  )
}
