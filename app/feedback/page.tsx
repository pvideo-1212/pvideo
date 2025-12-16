"use client"

import { useState } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { MessageSquare, Send, CheckCircle, Star } from 'lucide-react'

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-8 h-8 text-[#FF9000]" />
          <h1 className="text-3xl font-bold text-white">Send Feedback</h1>
        </div>

        {submitted ? (
          <div className="bg-[#1a1a1a] border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Thank You!</h2>
            <p className="text-gray-400">Your feedback helps us improve our platform.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">How would you rate your experience?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setRating(n)}
                    className={`p-2 rounded-lg transition-colors ${rating >= n ? 'text-[#FF9000]' : 'text-gray-600 hover:text-gray-400'}`}>
                    <Star className={`w-8 h-8 ${rating >= n ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#FF9000]">
                <option value="">Select...</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="design">Design/UX</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Feedback *</label>
              <textarea required rows={5}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] resize-none"
                placeholder="Tell us what you think..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email (optional)</label>
              <input type="email"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]"
                placeholder="your@email.com" />
            </div>

            <button type="submit"
              className="w-full py-3 bg-[#FF9000] hover:bg-[#FFa020] text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />Submit Feedback
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
