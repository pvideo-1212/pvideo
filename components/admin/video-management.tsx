"use client"

import { useState, useEffect } from "react"
import { videoDb } from "@/lib/db"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  instructor: string
  duration: string
  views: number
  rating: number
  date: string
}

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    tags: "",
    instructor: "",
    duration: "",
  })

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    const data = await videoDb.getAll()
    setVideos(data)
  }

  const handleAddVideo = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      tags: "",
      instructor: "",
      duration: "",
    })
    setShowForm(true)
  }

  const handleEditVideo = (video: Video) => {
    setEditingId(video.id)
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      subcategory: video.subcategory,
      tags: video.tags.join(", "),
      instructor: video.instructor,
      duration: video.duration,
    })
    setShowForm(true)
  }

  const handleSaveVideo = async () => {
    if (!formData.title || !formData.instructor) {
      alert("Please fill in all required fields")
      return
    }

    const videoData = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
      views: editingId ? videos.find((v) => v.id === editingId)?.views || 0 : 0,
      rating: editingId ? videos.find((v) => v.id === editingId)?.rating || 0 : 0,
      date: new Date().toISOString().split("T")[0],
      videoUrl: "",
      thumbnail: "/placeholder.svg?height=200&width=350",
      likes: 0,
    }

    if (editingId) {
      await videoDb.update(editingId, videoData)
    } else {
      await videoDb.create(videoData)
    }

    loadVideos()
    setShowForm(false)
  }

  const handleDeleteVideo = async (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      await videoDb.delete(id)
      loadVideos()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Video Management</h2>
        <button
          onClick={handleAddVideo}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingId ? "Edit Video" : "Add New Video"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Video title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Instructor *</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Instructor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="e.g., leadership"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="e.g., management"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="e.g., 45:30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="e.g., leadership, management"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                placeholder="Video description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSaveVideo}
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
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Instructor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{video.title}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{video.instructor}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{video.category}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{video.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{video.rating}%</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEditVideo(video)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
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
