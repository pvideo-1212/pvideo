import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Link2, DollarSign, TrendingUp, BarChart, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Affiliates - Pornhub' }

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link2 className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Affiliate Program</h1>
        </div>

        <div className="bg-gradient-to-r from-[#FF9000]/20 to-[#FF6B00]/10 border border-[#FF9000]/30 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Earn Money With Us</h2>
          <p className="text-gray-300">Join our affiliate program and earn commissions by referring traffic to our platform.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Program Benefits</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <DollarSign className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">High Payouts</h3>
            <p className="text-gray-400 text-sm">Competitive commission rates on all referrals</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <TrendingUp className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">High Conversion</h3>
            <p className="text-gray-400 text-sm">Our brand recognition drives conversions</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <BarChart className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Tracking</h3>
            <p className="text-gray-400 text-sm">Advanced tracking and analytics dashboard</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">1.</span>Sign up for our affiliate program</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">2.</span>Get your unique tracking links</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">3.</span>Promote on your website or channels</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">4.</span>Earn commissions on all referrals</li>
          </ol>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Join Now</h2>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-semibold rounded-lg hover:bg-[#FFa020] transition-colors">
            Apply Now<ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
