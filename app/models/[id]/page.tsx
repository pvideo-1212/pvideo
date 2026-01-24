import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { scrapeSearchFast } from '@/lib/scraper/scrape-fast'
import ModelClient from './ModelClient'
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
  const modelName = slug.replace(/\+/g, ' ').replace(/_/g, ' ')

  if (!modelName) {
    return {
      title: 'Model Not Found - TubeX',
    }
  }

  return {
    title: `${modelName} - Videos & Profile - TubeX`,
    description: `Watch free HD videos featuring ${modelName} on TubeX.`,
    openGraph: {
      type: 'profile',
      title: `${modelName} - TubeX`,
      description: `Watch free HD videos featuring ${modelName} on TubeX.`,
    },
  }
}

export default async function ModelDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const slug = typeof sp.slug === 'string' ? sp.slug : ''
  const modelName = slug.replace(/\+/g, ' ').replace(/_/g, ' ')

  if (!id || !slug) {
    // If we rely on URL params and they are missing, we can redirect or show not found
    // However, usually these params come from the route structure
  }

  // Server-side fetching using search (since we don't have a direct scrapeModel function yet that parses the model page details separately, search is the fallback used in client version)
  const data = await scrapeSearchFast(modelName, 1)

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ModelClient
        modelName={modelName}
        modelId={id}
        modelSlug={slug}
        initialVideos={data?.items || []}
      />
    </Suspense>
  )
}
