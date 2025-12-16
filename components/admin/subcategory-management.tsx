"use client"

import { useState, useEffect } from "react"
import { subcategoryDb, categoryDb } from "@/lib/db"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Subcategory {
  id: string
  categoryId: string
  name: string
  description: string
}

interface Category {
  id: string
  name: string
}

export default function SubcategoryManagement() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ categoryId: "", name: "", description: "" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const subs = await subcategoryDb.getAll()
    const cats = await categoryDb.getAll()
    setSubcategories(subs)
    setCategories(cats)
  }

  const handleAddSubcategory = () => {
    setEditingId(null)
    setFormData({ categoryId: "", name: "", description: "" })
    setShowForm(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingId(subcategory.id)
    setFormData(subcategory)
    setShowForm(true)
  }

  const handleSaveSubcategory = async () => {
    if (!formData.categoryId || !formData.name) {
      alert("Please fill in all required fields")
      return
    }

    if (editingId) {
      await subcategoryDb.update(editingId, formData)
    } else {
      await subcategoryDb.create(formData)
    }

    loadData()
    setShowForm(false)
  }

  const handleDeleteSubcategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      await subcategoryDb.delete(id)
      loadData()
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Subcategory Management</h2>
        <button
          onClick={handleAddSubcategory}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Subcategory
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {editingId ? "Edit Subcategory" : "Add New Subcategory"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Subcategory name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Subcategory description"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveSubcategory}
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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{subcategory.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{getCategoryName(subcategory.categoryId)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{subcategory.description}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEditSubcategory(subcategory)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubcategory(subcategory.id)}
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
