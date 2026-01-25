import { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy - Data Protection',
  description: 'Read the Privacy Policy for TubeX. Learn about our data collection practices, how we use your information, security measures, and cookie policies.',
  keywords: [
    'privacy policy', 'data protection', 'data collection', 'cookies policy',
    'user privacy', 'information security', 'data usage', 'SSL encryption',
    'personal data', 'privacy rights'
  ],
  openGraph: {
    type: 'website',
    title: 'Privacy Policy - TubeX',
    description: 'Learn about our privacy practices and data protection.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - TubeX',
    description: 'Read our privacy policy.',
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
