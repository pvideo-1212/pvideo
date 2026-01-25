'use client'

import { Lock, Eye, Server, ShieldCheck } from 'lucide-react'
import Header from '@/components/Header'
import { FooterAd } from '@/components/ad-banner'

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-gray-400">
              Your privacy is critically important to us.
            </p>
          </div>

          {/* Content */}
          <div className="glass rounded-3xl p-8 md:p-12 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-emerald-400" />
                Information Collection
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  We collect information to provide better services to all our users. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Information you give us (like account details).</li>
                  <li>Information we get from your use of our services (like usage data).</li>
                  <li>Device information (browser type, IP address - anonymized where possible).</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Server className="w-6 h-6 text-emerald-400" />
                Data Usage
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect our users.
                </p>
                <p className="mt-4">
                  We verify age compliance without storing personally identifiable information unnecessarily.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Security
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  We work hard to protect our platform and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
                </p>
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-emerald-200 text-sm">
                    We use SSL encryption for all data transmission.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  We use cookies to improve your user experience and for analytics purposes. You can control cookies through your browser settings.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <FooterAd />
    </div>
  )
}
