import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { User, Star, DollarSign, Camera, Shield, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Modelhub - Pornhub' }

export default function ModelhubPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Modelhub</h1>
        </div>

        <div className="bg-gradient-to-r from-[#FF9000]/20 to-[#FF6B00]/10 border border-[#FF9000]/30 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Become a Verified Model</h2>
          <p className="text-gray-300">Join Modelhub and take control of your content. Earn money doing what you love.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Why Join Modelhub?</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <DollarSign className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Keep 80% of Earnings</h3>
            <p className="text-gray-400 text-sm">Industry-leading revenue share for content creators</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Star className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Verified Badge</h3>
            <p className="text-gray-400 text-sm">Get verified and stand out from the crowd</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Camera className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Content Control</h3>
            <p className="text-gray-400 text-sm">Full control over your content and pricing</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Shield className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Protection</h3>
            <p className="text-gray-400 text-sm">Advanced content protection and DMCA support</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">How to Get Started</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">1.</span>Create your Modelhub profile</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">2.</span>Submit verification documents</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">3.</span>Upload your content</li>
            <li className="flex gap-3"><span className="text-[#FF9000] font-bold">4.</span>Start earning!</li>
          </ol>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Ready to Start?</h2>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-semibold rounded-lg hover:bg-[#FFa020] transition-colors">
            Join Modelhub<ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
