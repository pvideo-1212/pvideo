"use client"

import { useState, useEffect } from "react"
import { categoryDb } from "@/lib/db"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await categoryDb.getAll()
    setCategories(data)
  }

  const handleAddCategory = () => {
    setEditingId(null)
    setFormData({ name: "", description: "", icon: "" })
    setShowForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id)
    setFormData(category)
    setShowForm(true)
  }

  const handleSaveCategory = async () => {
    if (!formData.name) {
      alert("Please fill in all required fields")
      return
    }

    if (editingId) {
      await categoryDb.update(editingId, formData)
    } else {
      await categoryDb.create(formData)
    }

    loadCategories()
    setShowForm(false)
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await categoryDb.delete(id)
      loadCategories()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Category Management</h2>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingId ? "Edit Category" : "Add New Category"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="e.g., 👔"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{category.icon}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 text-primary hover:bg-primary/10 rounded transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
