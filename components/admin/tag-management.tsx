"use client"

import { useState, useEffect } from "react"
import { tagDb } from "@/lib/db"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
}

export default function TagManagement() {
  const [tags, setTags] = useState<Tag[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", color: "blue" })

  const colors = ["blue", "red", "green", "yellow", "purple", "pink", "orange", "cyan"]

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    const data = await tagDb.getAll()
    setTags(data)
  }

  const handleAddTag = () => {
    setEditingId(null)
    setFormData({ name: "", color: "blue" })
    setShowForm(true)
  }

  const handleEditTag = (tag: Tag) => {
    setEditingId(tag.id)
    setFormData(tag)
    setShowForm(true)
  }

  const handleSaveTag = async () => {
    if (!formData.name) {
      alert("Please fill in all required fields")
      return
    }

    if (editingId) {
      await tagDb.update(editingId, formData)
    } else {
      await tagDb.create(formData)
    }

    loadTags()
    setShowForm(false)
  }

  const handleDeleteTag = async (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      await tagDb.delete(id)
      loadTags()
    }
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      red: "bg-red-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      cyan: "bg-cyan-500",
    }
    return colorMap[color] || "bg-blue-500"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Tag Management</h2>
        <button
          onClick={handleAddTag}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Tag
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingId ? "Edit Tag" : "Add New Tag"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Tag name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full ${getColorClass(color)} ${
                      formData.color === color ? "ring-2 ring-offset-2 ring-foreground" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveTag}
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
        {tags.map((tag) => (
          <div key={tag.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getColorClass(tag.color)}`} />
              <span className="font-medium text-foreground">{tag.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditTag(tag)}
                className="p-2 text-primary hover:bg-primary/10 rounded transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
