'use client'

import { FileText, Scale, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import { FooterAd } from '@/components/ad-banner'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of <span className="text-blue-400">Service</span>
            </h1>
            <p className="text-gray-400">
              Please read these terms carefully before using our platform.
            </p>
          </div>

          {/* Content */}
          <div className="glass rounded-3xl p-8 md:p-12 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm">1</span>
                Acceptance of Terms
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm">2</span>
                Age Restriction
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-4">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-200">
                    You must be at least 18 years of age (or the age of majority in your jurisdiction) to access this website. By accessing this website, you warrant that you are at least 18 years old.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm">3</span>
                Content Policy
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  All content on this website is intended for adult audiences only. We have a zero-tolerance policy towards illegal content. All models appearing on this website are 18 years of age or older.
                </p>
                <p className="mt-4">
                  We reserve the right to remove any content that violates our policies or applicable laws without prior notice.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm">4</span>
                User Conduct
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>You agree not to use the website to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Upload or transmit any content that is unlawful, harmful, or violates any person's rights.</li>
                  <li>Impersonate any person or entity.</li>
                  <li>Interfere with or disrupt the service or servers.</li>
                  <li>Collect or harvest personal data about other users.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 text-sm">5</span>
                Intellectual Property
              </h2>
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed">
                <p>
                  The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights. Detailed information can be found in our DMCA policy.
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
