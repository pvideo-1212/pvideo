'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TubeX
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium adult entertainment platform providing high-quality streaming experience. Safe, secure, and discreet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Models
                </Link>
              </li>
              <li>
                <Link href="/channels" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Channels
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  DMCA Also
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <a href="mailto:support@pornhub1.fun" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4" />
                support@pornhub1.fun
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} TubeX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-xs">18+ Adults Only</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
