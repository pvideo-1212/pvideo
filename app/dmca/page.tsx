import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { FileWarning } from 'lucide-react'

export const metadata = { title: 'DMCA - Pornhub' }

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileWarning className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">DMCA Notice & Takedown Policy</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Copyright Infringement Notification</h2>
            <p>We respect the intellectual property rights of others and expect our users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our DMCA Agent with the following information:</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Required Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A physical or electronic signature of the copyright owner or authorized agent</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Identification of the material that is claimed to be infringing, with enough detail to locate it</li>
              <li>Your contact information (address, telephone number, email address)</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized</li>
              <li>A statement that the information in your notice is accurate, under penalty of perjury</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">How to Submit a DMCA Notice</h2>
            <p>Please send your DMCA takedown notice to:</p>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 mt-4">
              <p><strong className="text-white">Email:</strong> dmca@pornhub.com</p>
              <p className="mt-2"><strong className="text-white">Subject Line:</strong> DMCA Takedown Request</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Counter-Notification</h2>
            <p>If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification containing:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that was removed and its former location</li>
              <li>A statement under penalty of perjury that you believe the material was removed by mistake</li>
              <li>Your name, address, and telephone number</li>
              <li>Consent to the jurisdiction of the federal court in your district</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Repeat Infringers</h2>
            <p>We have a policy of terminating accounts of repeat infringers in appropriate circumstances.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
