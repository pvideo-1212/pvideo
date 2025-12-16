import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Shield } from 'lucide-react'

export const metadata = { title: 'Privacy Policy - Pornhub' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <p className="text-gray-400">Last updated: January 1, 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>We may collect information you provide directly, such as when you contact us. We also automatically collect certain information when you visit our site, including IP address, browser type, and device information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Information</h2>
            <p>We use collected information to provide and improve our services, respond to inquiries, and ensure the security of our website. We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookie settings through your browser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Third-Party Services</h2>
            <p>Our site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Children's Privacy</h2>
            <p>Our service is not intended for anyone under 18 years of age. We do not knowingly collect personal information from minors.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us through our Contact page.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
