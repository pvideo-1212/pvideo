import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { scrapeSearchFast } from '@/lib/scraper/scrape-fast'
import ChannelClient from './ChannelClient'
import { Loader2 } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const channelName = slug.replace(/\+/g, ' ').replace(/_/g, ' ')

  if (!channelName) {
    return {
      title: 'Channel Not Found - TubeX',
    }
  }

  return {
    title: `${channelName} - Videos & Profile - TubeX`,
    description: `Watch free HD videos from ${channelName} on TubeX.`,
    openGraph: {
      type: 'profile',
      title: `${channelName} - TubeX`,
      description: `Watch free HD videos from ${channelName} on TubeX.`,
    },
  }
}

export default async function ChannelDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const slug = typeof sp.slug === 'string' ? sp.slug : ''
  const channelName = slug.replace(/\+/g, ' ').replace(/_/g, ' ')

  if (!id || !slug) {
    // If param check fails
  }

  // Server-side fetching using search
  const data = await scrapeSearchFast(channelName, 1)

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ChannelClient
        channelName={channelName}
        channelId={id}
        channelSlug={slug}
        initialVideos={data?.items || []}
      />
    </Suspense>
  )
}
