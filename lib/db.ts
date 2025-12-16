interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  rating: number
  category: string
  subcategory: string
  tags: string[]
  instructor: string
  date: string
  videoUrl: string
  likes: number
  isFeatured?: boolean
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
}

interface Subcategory {
  id: string
  categoryId: string
  name: string
  description: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  plan: "free" | "pro" | "enterprise"
  role: "user" | "admin"
}

interface WatchHistory {
  id: string
  userId: string
  videoId: string
  watchedAt: string
  duration: number
  progress: number // percentage watched
}

// Enhanced mock data storage with realistic video content
const videosDb: Video[] = [
  {
    id: "1",
    title: "Advanced Leadership Strategies for Modern Organizations",
    description: "Learn advanced leadership strategies that will transform your management approach. This comprehensive course covers modern leadership techniques, team dynamics, and organizational psychology. Perfect for managers and executives looking to enhance their leadership skills.",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
    duration: "45:30",
    views: 12500,
    rating: 95,
    category: "leadership",
    subcategory: "management",
    tags: ["leadership", "management", "strategy", "team building"],
    instructor: "John Smith",
    date: "2024-10-15",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1250,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Data Analysis Fundamentals with Python",
    description: "Master the fundamentals of data analysis with practical examples and real-world applications. This course teaches you how to collect, process, and visualize data effectively using industry-standard tools like Python, Pandas, and Matplotlib.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    duration: "38:15",
    views: 8300,
    rating: 92,
    category: "technical",
    subcategory: "data-science",
    tags: ["data science", "python", "analytics", "visualization"],
    instructor: "Sarah Johnson",
    date: "2024-10-14",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 890,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Workplace Communication Excellence",
    description: "Develop exceptional communication skills that will elevate your professional relationships. Learn techniques for clear messaging, active listening, and conflict resolution in the workplace. This course covers both verbal and non-verbal communication strategies.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    duration: "32:45",
    views: 15200,
    rating: 98,
    category: "communication",
    subcategory: "soft-skills",
    tags: ["communication", "skills", "workplace", "professional development"],
    instructor: "Michael Chen",
    date: "2024-10-13",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1520,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Project Management Masterclass",
    description: "Become a certified project management professional with this comprehensive masterclass. Learn Agile, Scrum, and traditional project management methodologies. Perfect for aspiring PMs and team leaders looking to deliver projects on time and within budget.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
    duration: "52:00",
    views: 9800,
    rating: 94,
    category: "business",
    subcategory: "project-management",
    tags: ["project management", "agile", "scrum", "leadership"],
    instructor: "Emily Watson",
    date: "2024-10-12",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 980,
  },
  {
    id: "5",
    title: "Digital Marketing Strategy 2024",
    description: "Stay ahead of the curve with the latest digital marketing strategies. Learn SEO, social media marketing, content creation, and paid advertising techniques that drive real results. This course covers the most up-to-date tactics.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    duration: "41:20",
    views: 11200,
    rating: 91,
    category: "marketing",
    subcategory: "digital-marketing",
    tags: ["marketing", "seo", "social media", "content strategy"],
    instructor: "Lisa Anderson",
    date: "2024-10-11",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1120,
  },
  {
    id: "6",
    title: "Financial Planning for Professionals",
    description: "Take control of your financial future with expert guidance on budgeting, investing, and wealth building. This course covers everything from basic financial literacy to advanced investment strategies for long-term success.",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    duration: "35:45",
    views: 7600,
    rating: 89,
    category: "finance",
    subcategory: "personal-finance",
    tags: ["finance", "investing", "budgeting", "wealth management"],
    instructor: "Robert Martinez",
    date: "2024-10-10",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 760,
  },
  {
    id: "7",
    title: "UX Design Principles & Best Practices",
    description: "Learn the fundamental principles of user experience design. This course covers user research, wireframing, prototyping, and usability testing. Create designs that users love and businesses value.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    duration: "48:30",
    views: 10500,
    rating: 96,
    category: "technical",
    subcategory: "design",
    tags: ["ux design", "ui design", "user research", "prototyping"],
    instructor: "Jennifer Lee",
    date: "2024-10-09",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1050,
    isFeatured: true,
  },
  {
    id: "8",
    title: "Public Speaking Confidence",
    description: "Overcome your fear of public speaking and become a confident presenter. Learn techniques used by professional speakers to captivate audiences and deliver memorable presentations.",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop",
    duration: "28:15",
    views: 13400,
    rating: 97,
    category: "communication",
    subcategory: "public-speaking",
    tags: ["public speaking", "presentation", "confidence", "communication"],
    instructor: "David Williams",
    date: "2024-10-08",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1340,
  },
  {
    id: "9",
    title: "Machine Learning for Beginners",
    description: "Start your journey into artificial intelligence with this beginner-friendly machine learning course. Learn the fundamentals of ML algorithms, neural networks, and practical applications.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
    duration: "55:00",
    views: 16800,
    rating: 93,
    category: "technical",
    subcategory: "ai-ml",
    tags: ["machine learning", "ai", "python", "data science"],
    instructor: "Alex Thompson",
    date: "2024-10-07",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1680,
    isFeatured: true,
  },
  {
    id: "10",
    title: "Entrepreneurship Fundamentals",
    description: "Learn the essential skills needed to start and grow a successful business. From ideation to execution, this course covers funding, marketing, operations, and scaling your venture.",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop",
    duration: "42:30",
    views: 8900,
    rating: 90,
    category: "business",
    subcategory: "entrepreneurship",
    tags: ["entrepreneurship", "startup", "business", "innovation"],
    instructor: "Maria Garcia",
    date: "2024-10-06",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 890,
  },
]

const categoriesDb: Category[] = [
  { id: "1", name: "Leadership", description: "Leadership and management skills", icon: "👔" },
  { id: "2", name: "Technical", description: "Technical and programming skills", icon: "💻" },
  { id: "3", name: "Communication", description: "Communication and soft skills", icon: "💬" },
  { id: "4", name: "Business", description: "Business strategy and operations", icon: "📈" },
  { id: "5", name: "Marketing", description: "Marketing and branding", icon: "📢" },
  { id: "6", name: "Finance", description: "Financial planning and investment", icon: "💰" },
]

const subcategoriesDb: Subcategory[] = [
  { id: "1", categoryId: "1", name: "Management", description: "Management techniques" },
  { id: "2", categoryId: "1", name: "Team Building", description: "Team building strategies" },
  { id: "3", categoryId: "2", name: "Data Science", description: "Data science and analytics" },
  { id: "4", categoryId: "2", name: "Web Development", description: "Web development skills" },
  { id: "5", categoryId: "2", name: "Design", description: "UX/UI Design" },
  { id: "6", categoryId: "2", name: "AI & ML", description: "Artificial Intelligence and Machine Learning" },
  { id: "7", categoryId: "3", name: "Soft Skills", description: "Soft skills development" },
  { id: "8", categoryId: "3", name: "Public Speaking", description: "Public speaking and presentation" },
  { id: "9", categoryId: "4", name: "Project Management", description: "Project management methodologies" },
  { id: "10", categoryId: "4", name: "Entrepreneurship", description: "Starting and growing businesses" },
  { id: "11", categoryId: "5", name: "Digital Marketing", description: "Online marketing strategies" },
  { id: "12", categoryId: "6", name: "Personal Finance", description: "Personal financial planning" },
]

const tagsDb: Tag[] = [
  { id: "1", name: "leadership", color: "blue" },
  { id: "2", name: "management", color: "purple" },
  { id: "3", name: "data science", color: "green" },
  { id: "4", name: "communication", color: "orange" },
  { id: "5", name: "skills", color: "pink" },
  { id: "6", name: "python", color: "yellow" },
  { id: "7", name: "marketing", color: "red" },
  { id: "8", name: "finance", color: "emerald" },
  { id: "9", name: "ai", color: "cyan" },
  { id: "10", name: "startup", color: "violet" },
]

const usersDb: User[] = [
  {
    id: "admin-001",
    email: "admin@example.com",
    name: "Admin User",
    createdAt: "2024-01-01",
    plan: "enterprise",
    role: "admin",
  },
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    createdAt: "2024-01-15",
    plan: "pro",
    role: "user",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    createdAt: "2024-02-20",
    plan: "free",
    role: "user",
  },
]

const watchHistoryEntries: WatchHistory[] = []

// Video operations
export const videoDb = {
  getAll: async (): Promise<Video[]> => {
    return videosDb
  },

  getById: async (id: string): Promise<Video | null> => {
    return videosDb.find((v) => v.id === id) || null
  },

  getFeatured: async (): Promise<Video[]> => {
    return videosDb.filter((v) => v.isFeatured)
  },

  create: async (video: Omit<Video, "id">): Promise<Video> => {
    const newVideo: Video = {
      ...video,
      id: Date.now().toString(),
    }
    videosDb.push(newVideo)
    return newVideo
  },

  update: async (id: string, updates: Partial<Video>): Promise<Video | null> => {
    const index = videosDb.findIndex((v) => v.id === id)
    if (index === -1) return null
    videosDb[index] = { ...videosDb[index], ...updates }
    return videosDb[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = videosDb.findIndex((v) => v.id === id)
    if (index === -1) return false
    videosDb.splice(index, 1)
    return true
  },

  search: async (query: string, category?: string): Promise<Video[]> => {
    return videosDb.filter((v) => {
      const matchesQuery =
        v.title.toLowerCase().includes(query.toLowerCase()) || v.instructor.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || v.category === category
      return matchesQuery && matchesCategory
    })
  },

  getByCategory: async (category: string): Promise<Video[]> => {
    return videosDb.filter((v) => v.category === category)
  },

  getBySubcategory: async (subcategory: string): Promise<Video[]> => {
    return videosDb.filter((v) => v.subcategory === subcategory)
  },

  getByTag: async (tag: string): Promise<Video[]> => {
    return videosDb.filter((v) => v.tags.includes(tag))
  },

  getTopRated: async (limit = 10): Promise<Video[]> => {
    return [...videosDb].sort((a, b) => b.rating - a.rating).slice(0, limit)
  },

  getMostViewed: async (limit = 10): Promise<Video[]> => {
    return [...videosDb].sort((a, b) => b.views - a.views).slice(0, limit)
  },

  getTrending: async (limit = 5): Promise<Video[]> => {
    // Trending = high views + high rating + recent
    return [...videosDb]
      .sort((a, b) => {
        const scoreA = a.views * 0.5 + a.rating * 100 + (new Date(a.date).getTime() / 1000000000)
        const scoreB = b.views * 0.5 + b.rating * 100 + (new Date(b.date).getTime() / 1000000000)
        return scoreB - scoreA
      })
      .slice(0, limit)
  },
}

// Category operations
export const categoryDb = {
  getAll: async (): Promise<Category[]> => {
    return categoriesDb
  },

  getById: async (id: string): Promise<Category | null> => {
    return categoriesDb.find((c) => c.id === id) || null
  },

  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    categoriesDb.push(newCategory)
    return newCategory
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const index = categoriesDb.findIndex((c) => c.id === id)
    if (index === -1) return null
    categoriesDb[index] = { ...categoriesDb[index], ...updates }
    return categoriesDb[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = categoriesDb.findIndex((c) => c.id === id)
    if (index === -1) return false
    categoriesDb.splice(index, 1)
    return true
  },
}

// Subcategory operations
export const subcategoryDb = {
  getAll: async (): Promise<Subcategory[]> => {
    return subcategoriesDb
  },

  getByCategoryId: async (categoryId: string): Promise<Subcategory[]> => {
    return subcategoriesDb.filter((s) => s.categoryId === categoryId)
  },

  create: async (subcategory: Omit<Subcategory, "id">): Promise<Subcategory> => {
    const newSubcategory: Subcategory = {
      ...subcategory,
      id: Date.now().toString(),
    }
    subcategoriesDb.push(newSubcategory)
    return newSubcategory
  },

  update: async (id: string, updates: Partial<Subcategory>): Promise<Subcategory | null> => {
    const index = subcategoriesDb.findIndex((s) => s.id === id)
    if (index === -1) return null
    subcategoriesDb[index] = { ...subcategoriesDb[index], ...updates }
    return subcategoriesDb[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = subcategoriesDb.findIndex((s) => s.id === id)
    if (index === -1) return false
    subcategoriesDb.splice(index, 1)
    return true
  },
}

// Tag operations
export const tagDb = {
  getAll: async (): Promise<Tag[]> => {
    return tagsDb
  },

  create: async (tag: Omit<Tag, "id">): Promise<Tag> => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
    }
    tagsDb.push(newTag)
    return newTag
  },

  update: async (id: string, updates: Partial<Tag>): Promise<Tag | null> => {
    const index = tagsDb.findIndex((t) => t.id === id)
    if (index === -1) return null
    tagsDb[index] = { ...tagsDb[index], ...updates }
    return tagsDb[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = tagsDb.findIndex((t) => t.id === id)
    if (index === -1) return false
    tagsDb.splice(index, 1)
    return true
  },
}

// User operations
export const userDb = {
  getAll: async (): Promise<User[]> => {
    return usersDb
  },

  getById: async (id: string): Promise<User | null> => {
    return usersDb.find((u) => u.id === id) || null
  },

  getByEmail: async (email: string): Promise<User | null> => {
    return usersDb.find((u) => u.email === email) || null
  },

  create: async (user: Omit<User, "id" | "createdAt" | "plan">): Promise<User> => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      plan: "free",
    }
    usersDb.push(newUser)
    return newUser
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const index = usersDb.findIndex((u) => u.id === id)
    if (index === -1) return null
    usersDb[index] = { ...usersDb[index], ...updates }
    return usersDb[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = usersDb.findIndex((u) => u.id === id)
    if (index === -1) return false
    usersDb.splice(index, 1)
    return true
  },

  getTotalCount: async (): Promise<number> => {
    return usersDb.length
  },
}

// Watch History operations
export const watchHistoryOperations = {
  getByUserId: async (userId: string): Promise<WatchHistory[]> => {
    return watchHistoryEntries
      .filter((w) => w.userId === userId)
      .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
  },

  getByUserAndVideo: async (userId: string, videoId: string): Promise<WatchHistory | null> => {
    return watchHistoryEntries.find((w) => w.userId === userId && w.videoId === videoId) || null
  },

  create: async (history: Omit<WatchHistory, "id">): Promise<WatchHistory> => {
    const newHistory: WatchHistory = {
      ...history,
      id: Date.now().toString(),
    }
    watchHistoryEntries.push(newHistory)
    return newHistory
  },

  update: async (id: string, updates: Partial<WatchHistory>): Promise<WatchHistory | null> => {
    const index = watchHistoryEntries.findIndex((w) => w.id === id)
    if (index === -1) return null
    watchHistoryEntries[index] = { ...watchHistoryEntries[index], ...updates }
    return watchHistoryEntries[index]
  },

  delete: async (id: string): Promise<boolean> => {
    const index = watchHistoryEntries.findIndex((w) => w.id === id)
    if (index === -1) return false
    watchHistoryEntries.splice(index, 1)
    return true
  },

  filter: (predicate: (w: WatchHistory) => boolean) => {
    return watchHistoryEntries.filter(predicate)
  },
}

// Analytics operations
export const analyticsDb = {
  getStats: async () => {
    return {
      totalVideos: videosDb.length,
      totalUsers: usersDb.length,
      totalViews: videosDb.reduce((sum, v) => sum + v.views, 0),
      averageRating: (videosDb.reduce((sum, v) => sum + v.rating, 0) / videosDb.length).toFixed(1),
      totalLikes: videosDb.reduce((sum, v) => sum + v.likes, 0),
    }
  },

  getTopVideos: async (limit = 5) => {
    return [...videosDb].sort((a, b) => b.views - a.views).slice(0, limit)
  },

  getTopInstructors: async (limit = 5) => {
    const instructorStats = videosDb.reduce(
      (acc, video) => {
        const existing = acc.find((i) => i.name === video.instructor)
        if (existing) {
          existing.views += video.views
          existing.videoCount += 1
        } else {
          acc.push({
            name: video.instructor,
            views: video.views,
            videoCount: 1,
          })
        }
        return acc
      },
      [] as Array<{ name: string; views: number; videoCount: number }>,
    )
    return instructorStats.sort((a, b) => b.views - a.views).slice(0, limit)
  },
}
