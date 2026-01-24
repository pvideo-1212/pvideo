import { Suspense } from 'react'
import { Metadata } from 'next'
import { scrapeModels } from '@/lib/scraper/scraper'
import ModelsClient from './ModelsClient'
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
    title: `Pornstars & Models - TubeX - Page ${page}`,
    description: `Browse thousands of pornstars and models on TubeX. Page ${page}.`,
    openGraph: {
      type: 'website',
      title: 'Pornstars & Models - TubeX',
    },
  }
}

export default async function ModelsPage({ searchParams }: Props) {
  const params = await searchParams
  const currentPage = parseInt((typeof params.page === 'string' ? params.page : '1'), 10)

  // Server-side fetching
  const data = await scrapeModels(currentPage)

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ModelsClient
        initialModels={data?.items || []}
        initialHasMore={data?.hasMore || false}
      />
    </Suspense>
  )
}
