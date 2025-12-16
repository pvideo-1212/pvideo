import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Scale } from 'lucide-react'

export const metadata = { title: 'Terms of Service - Pornhub' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <p className="text-gray-400">Last updated: January 1, 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Age Requirement</h2>
            <p>You must be at least 18 years of age (or the age of majority in your jurisdiction) to access this website. By using this site, you represent and warrant that you meet this age requirement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Content</h2>
            <p>All content on this website is for entertainment purposes only. We do not create or produce any content ourselves. All videos are provided by third-party sources.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. User Conduct</h2>
            <p>You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service. You must not attempt to gain unauthorized access to any part of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p>All content, trademarks, and other intellectual property on this website are the property of their respective owners. You may not copy, modify, or distribute any content without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
            <p>This service is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Contact</h2>
            <p>If you have questions about these terms, please contact us through our Contact page.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
