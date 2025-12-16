"use client"

import { useEffect, useState } from "react"
import { categoryDb } from "@/lib/db"
import { Briefcase, Code, MessageSquare, TrendingUp, Megaphone, Wallet, Sparkles } from "lucide-react"

interface CategoryNavProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

const categoryIcons: Record<string, typeof Briefcase> = {
  all: Sparkles,
  leadership: Briefcase,
  technical: Code,
  communication: MessageSquare,
  business: TrendingUp,
  marketing: Megaphone,
  finance: Wallet,
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  const [categories, setCategories] = useState<Array<{ id: string; label: string; icon: string }>>([
    { id: "all", label: "All Content", icon: "✨" }
  ])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryDb.getAll()
      const categoryList = [
        { id: "all", label: "All Content", icon: "✨" },
        ...data.map(cat => ({
          id: cat.name.toLowerCase(),
          label: cat.name,
          icon: cat.icon
        }))
      ]
      setCategories(categoryList)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  return (
    <div className="bg-card/50 border-b border-border sticky top-[73px] z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id
              const IconComponent = categoryIcons[category.id] || Sparkles

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap 
                    transition-all duration-200 shrink-0
                    ${isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "bg-muted/50 text-foreground hover:bg-muted hover:shadow-sm"
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
