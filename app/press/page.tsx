import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Newspaper, Download, Mail } from 'lucide-react'

export const metadata = { title: 'Press - Pornhub' }

const releases = [
  { date: 'Jan 15, 2025', title: 'Pornhub Announces Enhanced Safety Features' },
  { date: 'Dec 20, 2024', title: 'Year in Review: 2024 Statistics Released' },
  { date: 'Nov 10, 2024', title: 'New Mobile App Features Launched' },
  { date: 'Oct 5, 2024', title: 'Partnership with Safety Organizations Announced' },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Newspaper className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Press & Media</h1>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Media Inquiries</h2>
          <p className="text-gray-400 mb-4">For press inquiries, interview requests, or media information, please contact our communications team.</p>
          <a href="mailto:press@pornhub.com" className="inline-flex items-center gap-2 text-[#FF9000] hover:underline">
            <Mail className="w-4 h-4" />press@pornhub.com
          </a>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Press Releases</h2>

        <div className="space-y-4 mb-10">
          {releases.map((release, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#FF9000]/50 transition-colors">
              <span className="text-sm text-gray-500">{release.date}</span>
              <h3 className="text-white font-medium mt-1 hover:text-[#FF9000] cursor-pointer">{release.title}</h3>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Brand Assets</h2>
          <p className="text-gray-400 mb-4">Download official logos, brand guidelines, and media assets.</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors">
            <Download className="w-4 h-4" />Download Press Kit
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
