import { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms of Service - User Agreement',
  description: 'Read the Terms of Service for TubeX. Understand our user agreement, age restrictions, content policy, user conduct rules, and intellectual property rights.',
  keywords: [
    'terms of service', 'user agreement', 'terms and conditions', 'legal terms',
    'age restriction', 'content policy', 'user conduct', 'intellectual property',
    'website terms', 'platform rules'
  ],
  openGraph: {
    type: 'website',
    title: 'Terms of Service - TubeX',
    description: 'Read and understand our terms of service.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service - TubeX',
    description: 'Read our terms of service.',
  },
}

export default function TermsPage() {
  return <TermsClient />
}
