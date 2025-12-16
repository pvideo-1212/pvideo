import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Megaphone, BarChart, Users, Globe, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Advertise - Pornhub' }

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Megaphone className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Advertise With Us</h1>
        </div>

        <div className="bg-gradient-to-r from-[#FF9000]/20 to-[#FF6B00]/10 border border-[#FF9000]/30 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Reach Millions of Users</h2>
          <p className="text-gray-300">Pornhub offers premium advertising solutions to help your brand reach a massive, engaged audience.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Why Advertise With Us?</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <BarChart className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Billions of Views</h3>
            <p className="text-gray-400 text-sm">Access to billions of monthly page views</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <Users className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Targeted Reach</h3>
            <p className="text-gray-400 text-sm">Advanced targeting options for your campaigns</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center">
            <Globe className="w-10 h-10 text-[#FF9000] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Global Presence</h3>
            <p className="text-gray-400 text-sm">Reach users in 180+ countries</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Get Started</h2>
          <p className="text-gray-400 mb-6">Contact our advertising team to discuss your campaign needs.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-semibold rounded-lg hover:bg-[#FFa020] transition-colors">
            Contact Us<ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
