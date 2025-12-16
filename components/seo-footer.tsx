"use client"

import Link from 'next/link'
import { POPULAR_SEARCHES, SEO_TAGS, CATEGORY_KEYWORDS } from '@/lib/seo-data'

export default function SeoFooter() {
  const allCategories = Object.keys(CATEGORY_KEYWORDS)

  return (
    <section className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-10">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Popular Searches */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(term => (
              <Link
                key={term}
                href={`/?search=${encodeURIComponent(term)}`}
                className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#FF9000]/20 border border-[#2a2a2a] hover:border-[#FF9000]/50 rounded text-sm text-gray-400 hover:text-[#FF9000] transition-all"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <Link
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}`}
                className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#FF9000]/20 border border-[#2a2a2a] hover:border-[#FF9000]/50 rounded text-sm text-gray-400 hover:text-[#FF9000] transition-all capitalize"
              >
                {cat.replace(/-/g, ' ')} Porn
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Tags Cloud */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Related Tags</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {SEO_TAGS.map(tag => (
              <Link
                key={tag}
                href={`/?search=${encodeURIComponent(tag.toLowerCase())}`}
                className="text-xs text-gray-500 hover:text-[#FF9000] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Long-form SEO Text */}
        <div className="border-t border-[#1a1a1a] pt-8">
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-500">Pornhub</strong> is the world&apos;s leading free porn site.
              Choose from millions of free porn videos that stream quickly and in high quality, including amazing
              <Link href="/?category=hd" className="text-[#FF9000] hover:underline mx-1">HD porn</Link>.
              The largest amateur porn community on the net as well as full-length scenes from the top studios.
              We update our porn videos daily to ensure you always get the best quality free
              <Link href="/?category=amateur" className="text-[#FF9000] hover:underline mx-1">amateur porn</Link>,
              <Link href="/?category=milf" className="text-[#FF9000] hover:underline mx-1">milf porn</Link>,
              <Link href="/?category=teen" className="text-[#FF9000] hover:underline mx-1">teen porn</Link>,
              <Link href="/?category=lesbian" className="text-[#FF9000] hover:underline mx-1">lesbian porn</Link>,
              and every other category you can think of. Watch
              <Link href="/?category=asian" className="text-[#FF9000] hover:underline mx-1">asian porn</Link>,
              <Link href="/?category=ebony" className="text-[#FF9000] hover:underline mx-1">ebony porn</Link>,
              <Link href="/?category=latina" className="text-[#FF9000] hover:underline mx-1">latina porn</Link>,
              <Link href="/?category=blonde" className="text-[#FF9000] hover:underline mx-1">blonde porn</Link>,
              <Link href="/?category=brunette" className="text-[#FF9000] hover:underline mx-1">brunette porn</Link>,
              and so much more. Free sex videos in full length for everyone.
              Stream free porn videos in
              <Link href="/?category=pov" className="text-[#FF9000] hover:underline mx-1">POV</Link>,
              <Link href="/?category=anal" className="text-[#FF9000] hover:underline mx-1">anal</Link>,
              <Link href="/?category=threesome" className="text-[#FF9000] hover:underline mx-1">threesome</Link>,
              and more categories. Our free porn tube is easy to browse on mobile and all content is 100% free.
            </p>
          </div>
        </div>

        {/* Country Links */}
        <div className="border-t border-[#1a1a1a] mt-8 pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Brazil'].map(country => (
              <span key={country} className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer">
                Pornhub {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
