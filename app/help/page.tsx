import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { HelpCircle, ChevronDown } from 'lucide-react'

export const metadata = { title: 'Help Center - Pornhub' }

const faqs = [
  { q: 'How do I search for videos?', a: 'Use the search bar at the top of the page. You can search by title, category, or performer name.' },
  { q: 'Why is a video buffering slowly?', a: 'Try lowering the video quality using the settings icon in the player. Also check your internet connection.' },
  { q: 'How do I report inappropriate content?', a: 'Click the "Report" link below any video or use our Report Content page to submit a report.' },
  { q: 'Is this site free to use?', a: 'Yes, all content on this site is completely free to view.' },
  { q: 'How do I contact support?', a: 'Visit our Contact page to send us a message. We respond within 24-48 hours.' },
  { q: 'What are the age requirements?', a: 'You must be 18 years or older (or the age of majority in your jurisdiction) to access this site.' },
  { q: 'How do I use keyboard shortcuts?', a: 'Space/K = Play/Pause, F = Fullscreen, M = Mute, Arrow keys = Seek/Volume, J/L = Skip 10s.' },
  { q: 'Can I download videos?', a: 'Downloading is not supported. Videos are for streaming only.' },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Help Center</h1>
        </div>

        <div className="mb-8">
          <input type="text" placeholder="Search help articles..."
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]" />
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer text-white font-medium list-none">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-gray-400">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a2a] text-center">
          <p className="text-gray-400 mb-4">Didn't find what you're looking for?</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-semibold rounded-lg hover:bg-[#FFa020] transition-colors">
            Contact Support
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
