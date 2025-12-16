import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Building2 } from 'lucide-react'

export const metadata = { title: 'About Us - Pornhub' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">About Pornhub</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <p className="text-lg">Pornhub is the world's leading free adult entertainment platform, providing millions of videos to users worldwide.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Our Mission</h2>
            <p>We are committed to providing a safe, secure, and enjoyable experience for adults seeking entertainment. Our platform prioritizes user privacy, content safety, and accessibility.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Millions of free videos across numerous categories</li>
              <li>High-quality streaming with adaptive quality</li>
              <li>Advanced search and filtering capabilities</li>
              <li>Mobile-optimized experience</li>
              <li>Regular content updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Our Commitment</h2>
            <p>We are dedicated to maintaining a platform that respects the rights of content creators and performers. We actively work to prevent unauthorized content and respond promptly to any concerns.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Safety First</h2>
            <p>User safety is our top priority. We implement robust age verification, content moderation, and security measures to ensure a safe environment for all users.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
