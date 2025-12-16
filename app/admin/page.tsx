"use client"

import { useState } from "react"
import { logout } from "@/app/actions/auth"
import Header from "@/components/header"
import AdminSidebar from "@/components/admin-sidebar"
import DashboardOverview from "@/components/dashboard-overview"
import { AlertCircle, LogOut } from "lucide-react"
import VideoManagement from "@/components/admin/video-management"
import CategoryManagement from "@/components/admin/category-management"
import SubcategoryManagement from "@/components/admin/subcategory-management"
import TagManagement from "@/components/admin/tag-management"
import UserManagement from "@/components/admin/user-management"
import AnalyticsView from "@/components/admin/analytics-view"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Header with Logout */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <form action={logout}>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>

      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 px-8 py-8">
          <div className="mb-8 flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              You are viewing the secure admin dashboard.
            </p>
          </div>

          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "videos" && <VideoManagement />}
          {activeTab === "categories" && <CategoryManagement />}
          {activeTab === "subcategories" && <SubcategoryManagement />}
          {activeTab === "tags" && <TagManagement />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "analytics" && <AnalyticsView />}
        </main>
      </div>
    </div>
  )
}
