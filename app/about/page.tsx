import { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About Us - Company Information',
  description: 'Learn about TubeX, the world\'s leading premium adult entertainment platform. Our mission, values, and commitment to providing high-quality streaming experience.',
  keywords: [
    'about TubeX', 'about us', 'company information', 'our mission',
    'streaming platform', 'video platform', 'adult entertainment',
    'HD streaming', '4K streaming', 'content quality'
  ],
  openGraph: {
    type: 'website',
    title: 'About TubeX - Our Mission & Values',
    description: 'Learn about TubeX and our commitment to quality entertainment.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary',
    title: 'About TubeX',
    description: 'Learn about TubeX and our mission.',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
