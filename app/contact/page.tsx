"use client"

import { useState } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Mail, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
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
          <Mail className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        </div>

        {submitted ? (
          <div className="bg-[#1a1a1a] border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Message Sent!</h2>
            <p className="text-gray-400">Thank you for contacting us. We will respond within 24-48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input type="email" required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]"
                placeholder="your@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <select required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#FF9000]">
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="content">Content Report</option>
                <option value="dmca">DMCA Request</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea required rows={6}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] resize-none"
                placeholder="How can we help you?" />
            </div>

            <button type="submit"
              className="w-full py-3 bg-[#FF9000] hover:bg-[#FFa020] text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />Send Message
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <h3 className="text-lg font-semibold text-white mb-4">Other Ways to Reach Us</h3>
          <div className="space-y-3 text-gray-400">
            <p><strong className="text-white">Email:</strong> support@pornhub.com</p>
            <p><strong className="text-white">Response Time:</strong> 24-48 hours</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
