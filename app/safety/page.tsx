import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { ShieldCheck, AlertTriangle, Eye, Lock, Users, Heart } from 'lucide-react'

export const metadata = { title: 'Safety Center - Pornhub' }

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Safety Center</h1>
        </div>

        <p className="text-lg text-gray-300 mb-10">Your safety and security are our top priorities. Here's how we protect you.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Lock className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Privacy Protection</h3>
            <p className="text-gray-400 text-sm">We use encryption and secure connections to protect your data. We never sell your personal information.</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Eye className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Content Moderation</h3>
            <p className="text-gray-400 text-sm">Our team reviews content to ensure it meets our guidelines and complies with applicable laws.</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Users className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Age Verification</h3>
            <p className="text-gray-400 text-sm">We require age verification to ensure only adults can access our content.</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <Heart className="w-8 h-8 text-[#FF9000] mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Performer Rights</h3>
            <p className="text-gray-400 text-sm">We respect performer rights and respond promptly to content removal requests.</p>
          </div>
        </div>

        <section className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Report Illegal Content</h3>
              <p className="text-gray-400 mb-4">If you encounter content that violates our policies or the law, please report it immediately.</p>
              <a href="/report" className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors">
                Report Content
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Online Safety Tips</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3"><span className="text-[#FF9000]">•</span>Never share personal information online</li>
            <li className="flex items-start gap-3"><span className="text-[#FF9000]">•</span>Use strong, unique passwords</li>
            <li className="flex items-start gap-3"><span className="text-[#FF9000]">•</span>Be cautious of phishing attempts</li>
            <li className="flex items-start gap-3"><span className="text-[#FF9000]">•</span>Keep your browser and devices updated</li>
            <li className="flex items-start gap-3"><span className="text-[#FF9000]">•</span>Use private browsing mode when appropriate</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
