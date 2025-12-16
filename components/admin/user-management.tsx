"use client"

import { useState, useEffect } from "react"
import { userDb } from "@/lib/db"
import { Trash2, Eye } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  plan: "free" | "pro" | "enterprise"
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await userDb.getAll()
    setUsers(data)
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await userDb.delete(id)
      loadUsers()
    }
  }

  const getPlanColor = (plan: string) => {
    const planColors: Record<string, string> = {
      free: "bg-muted text-muted-foreground",
      pro: "bg-primary/20 text-primary",
      enterprise: "bg-accent/20 text-accent",
    }
    return planColors[plan] || "bg-muted text-muted-foreground"
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">User Management</h2>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Plan</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Join Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button className="p-2 text-primary hover:bg-primary/10 rounded transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
