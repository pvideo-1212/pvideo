"use client"

import Link from 'next/link'
import { Twitter, Instagram, Youtube } from 'lucide-react'
import SeoFooter from './seo-footer'
import { MyBidBanner } from './ad-banner'

export default function SiteFooter() {
  return (
    <>
      <SeoFooter />

      {/* Pre-Footer Ad Banner */}
      <div className="w-full py-4 px-4 bg-[#0d0d0d] border-t border-[#1f1f1f]">
        <div className="max-w-[1600px] mx-auto rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-3">
          <MyBidBanner bannerId="2015214" className="w-full min-h-[90px]" />
        </div>
      </div>

      <footer className="bg-[#0a0a0a] border-t border-[#1f1f1f]">
        <div className="max-w-[1600px] mx-auto px-4 py-12">
          {/* Logo and Description */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
            <div className="max-w-md">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-extrabold text-white tracking-tight">Porn</span>
                <span className="text-2xl font-extrabold bg-[#FF9000] text-black px-2 py-0.5 rounded ml-0.5 tracking-tight">hub</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Pornhub is the world's leading free porn site. Choose from millions of hardcore videos that stream quickly and in high quality.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#FF9000] flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#FF9000] flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#FF9000] flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10">
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Contact</Link></li>
                <li><Link href="/press" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Press</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/dmca" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">DMCA</Link></li>
                <li><Link href="/2257" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">18 U.S.C. 2257</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Safety Center</Link></li>
                <li><Link href="/report" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Report Content</Link></li>
                <li><Link href="/feedback" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Feedback</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Home</Link></li>
                <li><Link href="/?view=categories" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Categories</Link></li>
                <li><Link href="/?view=channels" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Channels</Link></li>
                <li><Link href="/pornstars" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Pornstars</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Partners</h4>
              <ul className="space-y-2">
                <li><Link href="/advertise" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Advertise</Link></li>
                <li><Link href="/content-partner" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Content Partners</Link></li>
                <li><Link href="/affiliates" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Affiliates</Link></li>
                <li><Link href="/modelhub" className="text-gray-500 hover:text-[#FF9000] text-sm transition-colors">Modelhub</Link></li>
              </ul>
            </div>
          </div>

          {/* Trust & Safety */}
          <div className="border-t border-[#1f1f1f] pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                RTA Labeled
              </span>
              <span>ASACP Member</span>
              <span>DMCA Compliant</span>
              <span>Parental Controls</span>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-[#1f1f1f] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">
              © 2025 Pornhub. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs text-center">
              This site is restricted to adults 18 years of age or older. All models appearing on this website were 18 years or older at the time of photography.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
