"use client"

import { TrendingUp, Users, Crown, ArrowRight, Flame } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  const topCategories = [
    { name: "Popular", count: 2450 },
    { name: "Trending Now", count: 1832 },
    { name: "Most Viewed", count: 1654 },
    { name: "Top Rated", count: 1223 },
    { name: "New Releases", count: 856 },
    { name: "HD Videos", count: 3200 },
  ]

  const topModels = [
    { name: "Ava Rose", videos: 124, avatar: "AR", color: "from-orange-500 to-amber-500" },
    { name: "Luna Star", videos: 98, avatar: "LS", color: "from-orange-600 to-red-500" },
    { name: "Mia Flame", videos: 87, avatar: "MF", color: "from-yellow-500 to-orange-500" },
    { name: "Sophia Night", videos: 76, avatar: "SN", color: "from-amber-500 to-orange-600" },
    { name: "Emma Dreams", videos: 65, avatar: "ED", color: "from-orange-400 to-yellow-500" },
  ]

  return (
    <div className="w-80 space-y-6 shrink-0 hidden lg:block">
      {/* Trending Topics */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Hot Categories</h3>
          </div>
        </div>
        <div className="p-2">
          {topCategories.map((category, index) => (
            <a
              key={category.name}
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="group-hover:text-primary transition-colors">{category.name}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {category.count.toLocaleString()}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Top Models */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Top Models</h3>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {topModels.map((model) => (
            <a
              key={model.name}
              href="#"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${model.color} flex items-center justify-center text-black font-bold text-sm shadow-md`}>
                {model.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {model.name}
                </p>
                <p className="text-xs text-muted-foreground">{model.videos} videos</p>
              </div>
            </a>
          ))}
        </div>
        <div className="p-3 border-t border-border">
          <a href="#" className="flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline">
            View All Models
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Premium CTA */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-6 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <Crown className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-2">Go Premium</h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Unlock unlimited HD videos, ad-free streaming, and exclusive content.
          </p>
          <Link href="/signup">
            <button className="w-full bg-white text-primary font-semibold py-2.5 rounded-lg hover:bg-white/90 transition shadow-lg">
              Upgrade Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
