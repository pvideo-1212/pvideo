import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Film, Upload, DollarSign, Shield, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Content Partners - Pornhub' }

export default function ContentPartnerPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Film className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Content Partners</h1>
        </div>

        <div className="bg-gradient-to-r from-[#FF9000]/20 to-[#FF6B00]/10 border border-[#FF9000]/30 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Partner With Pornhub</h2>
          <p className="text-gray-300">Join our network of verified content partners and reach millions of viewers worldwide.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Partner Benefits</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Upload className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Easy Upload</h3>
            <p className="text-gray-400 text-sm">Simple tools to upload and manage your content library</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <DollarSign className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Revenue Share</h3>
            <p className="text-gray-400 text-sm">Competitive revenue sharing program</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Shield className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Content Protection</h3>
            <p className="text-gray-400 text-sm">Advanced tools to protect your content</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Film className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">Detailed analytics and performance insights</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Become a Partner</h2>
          <p className="text-gray-400 mb-6">Apply to join our content partner program today.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-semibold rounded-lg hover:bg-[#FFa020] transition-colors">
            Apply Now<ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
