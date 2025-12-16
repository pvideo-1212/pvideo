"use client"

import { Play, Flame, TrendingUp, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  const stats = [
    { icon: Video, value: "10K+", label: "Videos" },
    { icon: Users, value: "5M+", label: "Users" },
    { icon: TrendingUp, value: "99%", label: "Satisfaction" },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">Premium Adult Content</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-shadow-lg">
              Unlimited
              <span className="block mt-2">
                <span className="relative">
                  <span className="relative z-10">Entertainment</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-400/30 -skew-x-3" />
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
              Access thousands of exclusive premium videos. Stream in HD quality, anytime, anywhere. Join millions of satisfied users today.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="#videos">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 gap-2 px-8 shadow-lg font-bold">
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 px-8 bg-transparent">
                  Join Free
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Featured Video Card */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="aspect-video rounded-xl overflow-hidden mb-4 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop"
                    alt="Featured Video"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-black fill-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-500 text-black text-xs font-bold">
                    TRENDING
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">Most Popular This Week</h3>
                <p className="text-white/70 text-sm mb-4">Exclusive premium content for our members</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-black">
                      HD
                    </div>
                    <span className="text-white/80">4K Ultra HD</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/60">
                    <span>25:30</span>
                    <span>1.2M views</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 p-4 bg-white rounded-xl shadow-lg float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Course Completion</p>
                    <p className="text-lg font-bold text-gray-900">92%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 p-4 bg-white rounded-xl shadow-lg float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white" />
                  </div>
                  <p className="text-sm text-gray-600">+2.5k enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
