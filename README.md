# EduStream - Streaming Website Clone

A modern educational streaming platform built with Next.js, featuring video management, user authentication, and an admin dashboard.

## Features

- **Homepage with Video Grid** - Browse and discover educational videos with category filtering
- **Video Detail Page** - Watch videos with metadata, descriptions, and related content
- **Search and Filtering** - Advanced search with sorting by views, rating, and date
- **User Authentication** - Sign up, login, and user profiles with session management
- **Admin Dashboard** - Manage videos, users, and view analytics
- **Database Layer** - Mock database service with CRUD operations for videos and users
- **API Routes** - RESTful API endpoints for content management

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Homepage
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Sign up page
│   ├── profile/page.tsx         # User profile
│   ├── video/[id]/page.tsx      # Video detail page
│   ├── admin/page.tsx           # Admin dashboard
│   ├── api/
│   │   ├── videos/              # Video API routes
│   │   ├── users/               # User API routes
│   │   └── analytics/           # Analytics API routes
│   └── layout.tsx               # Root layout with auth provider
├── components/
│   ├── header.tsx               # Navigation header
│   ├── video-grid.tsx           # Video grid component
│   ├── video-card.tsx           # Individual video card
│   ├── video-player.tsx         # Video player
│   ├── filter-panel.tsx         # Search and filter panel
│   ├── auth-context.tsx         # Authentication context
│   ├── login-form.tsx           # Login form
│   ├── signup-form.tsx          # Sign up form
│   ├── admin-sidebar.tsx        # Admin navigation
│   └── dashboard-overview.tsx   # Admin dashboard stats
├── hooks/
│   ├── use-videos.ts            # Video data fetching hook
│   └── use-analytics.ts         # Analytics data fetching hook
├── lib/
│   └── db.ts                    # Mock database service
└── globals.css                  # Global styles with design tokens
\`\`\`

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database

The application uses a mock database service (`lib/db.ts`) that stores data in memory. For production, replace this with a real database like:

- Supabase (PostgreSQL)
- MongoDB
- Firebase
- Neon

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos with optional filtering
- `GET /api/videos/[id]` - Get a specific video
- `POST /api/videos` - Create a new video
- `PUT /api/videos/[id]` - Update a video
- `DELETE /api/videos/[id]` - Delete a video

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Analytics
- `GET /api/analytics?type=stats` - Get platform statistics
- `GET /api/analytics?type=top-videos` - Get top videos
- `GET /api/analytics?type=top-instructors` - Get top instructors

## Authentication

The app uses React Context for authentication with localStorage persistence. Users can:
- Sign up with email and password
- Log in to their account
- View their profile
- Log out

Protected routes redirect unauthenticated users to the login page.

## Styling

The application uses Tailwind CSS v4 with custom design tokens defined in `globals.css`. The color scheme features:
- Dark background (oklch(0.12 0 0))
- Yellow/gold primary color (oklch(0.75 0.2 70))
- Neutral grays for secondary elements

## Future Enhancements

- Real database integration
- Video upload functionality
- User watchlist and favorites
- Comments and ratings system
- Email notifications
- Payment integration for premium content
- Advanced analytics and reporting
