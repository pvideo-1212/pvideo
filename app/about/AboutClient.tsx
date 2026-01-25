'use client'

import { Info, Shield, Heart, Flag, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import { FooterAd } from '@/components/ad-banner'

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6">
              <Info className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">TubeX</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The world's leading premium adult entertainment platform, providing high-quality streaming experience to millions of users worldwide.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Mission */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex gap-6">
                <div className="hidden md:flex flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-xl items-center justify-center">
                  <Flag className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                  <p className="text-gray-400 leading-relaxed">
                    We are committed to providing a safe, secure, and enjoyable experience for adults seeking entertainment.
                    Our platform prioritisies user privacy, experience, and content quality above all else.
                    We believe in creating a platform that is accessible, fast, and respectful to all parties involved.
                  </p>
                </div>
              </div>
            </div>

            {/* What We Offer */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl hover:border-pink-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                  What We Offer
                </h3>
                <ul className="space-y-4">
                  {[
                    'Millions of high-quality videos',
                    'HD & 4K streaming support',
                    'Advanced search & filtering',
                    'Mobile-optimized experience',
                    'Daily content updates'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400">
                      <CheckCircle className="w-5 h-5 text-pink-500/50 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass p-8 rounded-3xl hover:border-blue-500/30 transition-colors">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-400" />
                  Our Commitment
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  We are dedicated to maintaining a platform that respects the rights of content creators and performers.
                  We actively work to prevent unauthorized content and respond promptly to any concerns.
                </p>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-sm text-gray-500">
                    Safety is our top priority. We implement robust age verification and security measures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterAd />
    </div>
  )
}
