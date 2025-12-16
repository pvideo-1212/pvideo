import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { FileCheck } from 'lucide-react'

export const metadata = { title: '18 U.S.C. 2257 - Pornhub' }

export default function Page2257() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileCheck className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">18 U.S.C. 2257 Compliance Statement</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Record-Keeping Requirements Compliance Statement</h2>
            <p>All content and images displayed on this website are in full compliance with the requirements of 18 U.S.C. 2257 and associated regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Primary Producer</h2>
            <p>This website is not the primary producer (as that term is defined in 18 U.S.C. section 2257 and 28 C.F.R. 75.1(c)) of any of the visual content contained within this website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Third-Party Content</h2>
            <p>All visual content on this site is provided by third-party content providers. The respective content providers maintain records required pursuant to 18 U.S.C. 2257 and its regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Age Verification</h2>
            <p>All persons depicted herein were at least 18 years of age at the time of photography. Proof of age documentation is on file with the custodian of records for each content provider.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Custodian of Records</h2>
            <p>For information regarding the custodian of records for any content, please contact the respective content provider directly. Their contact information can be found on their respective websites.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Exemption Statement</h2>
            <p>With respect to content created by third parties, this website relies on the exemption provided by 28 C.F.R. 75.2(a)(1)(iii) and, with respect to such content, the operators of this website are not the producers (primary or secondary, as those terms are defined in 28 C.F.R. 75.1) of such content.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
