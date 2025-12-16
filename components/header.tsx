"use client"

import React, { useState, useEffect } from "react"
import { Search, Moon, Sun, LogOut, User, Menu, X, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "./auth-context"
import { useTheme } from "./theme-provider"
import Link from "next/link"

interface HeaderProps {
  onSearch: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch(value)
  }

  const navLinks = [
    { label: "Videos", href: "/" },
    { label: "Categories", href: "#" },
    { label: "Models", href: "#" },
    { label: "Live", href: "#" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'glass-strong border-b border-border shadow-sm'
          : 'bg-card/80 backdrop-blur-sm border-b border-transparent'
          }`}
      >
        <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 group">
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Porn</span>
                <span className="text-2xl sm:text-3xl font-extrabold bg-primary text-black px-2 py-0.5 rounded-md ml-0.5 tracking-tight">hub</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search videos, categories, models..."
                  value={searchValue}
                  onChange={handleSearch}
                  className="pl-11 pr-4 py-2.5 bg-muted/50 border-transparent text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary/50 rounded-xl transition-all"
                />
                {searchValue && (
                  <button
                    onClick={() => {
                      setSearchValue("")
                      onSearch("")
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl hover:bg-muted"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* Notifications */}
              {user && (
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="gap-2 rounded-xl hover:bg-muted hidden sm:flex"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name.split(' ')[0]}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="rounded-xl hidden sm:flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchValue}
                onChange={handleSearch}
                className="pl-11 bg-muted/50 border-transparent rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-60 border-t border-border' : 'max-h-0'
          }`}>
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
