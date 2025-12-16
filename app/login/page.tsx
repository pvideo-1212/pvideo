'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { useFormStatus } from 'react-dom'
import { Loader2, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-[#FF9000] text-black font-bold py-3 px-4 rounded-lg hover:bg-[#ff9000]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          Sign In
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  )
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function clientAction(formData: FormData) {
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block p-4 rounded-full bg-[#1a1a1a] mb-6 border border-[#2a2a2a]">
            <Lock className="w-8 h-8 text-[#FF9000]" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">Please enter your credentials to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl">
          <form action={clientAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF9000] transition-colors"
                placeholder="admin@pornhub1.fun"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#0d0d0d] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF9000] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <SubmitButton />
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          &copy; 2025 Pornhub Admin Panel. Secure Access Only.
        </p>
      </div>
    </div>
  )
}
