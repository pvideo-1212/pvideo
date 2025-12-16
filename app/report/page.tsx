"use client"

import { useState } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Flag, Send, CheckCircle } from 'lucide-react'

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Flag className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-white">Report Content</h1>
        </div>

        {submitted ? (
          <div className="bg-[#1a1a1a] border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Report Submitted</h2>
            <p className="text-gray-400">Thank you for your report. Our team will review it within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">We take all reports seriously and investigate each one thoroughly.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (if applicable)</label>
              <input type="url"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]"
                placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Report *</label>
              <select required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#FF9000]">
                <option value="">Select a reason...</option>
                <option value="illegal">Illegal Content</option>
                <option value="underage">Suspected Minor</option>
                <option value="nonconsent">Non-consensual Content</option>
                <option value="copyright">Copyright Violation</option>
                <option value="spam">Spam/Malware</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Email *</label>
              <input type="email" required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]"
                placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details *</label>
              <textarea required rows={4}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] resize-none"
                placeholder="Please provide as much detail as possible..." />
            </div>

            <button type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />Submit Report
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
