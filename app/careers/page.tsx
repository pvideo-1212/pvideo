import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Careers - Pornhub' }

const jobs = [
  { title: 'Senior Software Engineer', location: 'Remote', type: 'Full-time', dept: 'Engineering' },
  { title: 'Product Manager', location: 'Montreal, CA', type: 'Full-time', dept: 'Product' },
  { title: 'UX Designer', location: 'Remote', type: 'Full-time', dept: 'Design' },
  { title: 'Data Analyst', location: 'Remote', type: 'Full-time', dept: 'Analytics' },
  { title: 'Content Moderator', location: 'Remote', type: 'Full-time', dept: 'Trust & Safety' },
  { title: 'DevOps Engineer', location: 'Remote', type: 'Full-time', dept: 'Engineering' },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Careers</h1>
        </div>

        <div className="bg-gradient-to-r from-[#FF9000]/20 to-[#FF6B00]/10 border border-[#FF9000]/30 rounded-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-gray-300">We're always looking for talented individuals to help us build the future of adult entertainment. Enjoy competitive salaries, remote work options, and a dynamic team environment.</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Open Positions</h2>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#FF9000]/50 transition-colors group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#FF9000] transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
                    <span className="px-2 py-0.5 bg-[#2a2a2a] rounded text-xs">{job.dept}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9000] text-black font-medium rounded-lg hover:bg-[#FFa020] transition-colors shrink-0">
                  Apply<ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a2a] text-center">
          <p className="text-gray-400 mb-4">Don't see a position that fits? Send us your resume anyway!</p>
          <a href="/contact" className="text-[#FF9000] hover:underline">Contact Us</a>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
