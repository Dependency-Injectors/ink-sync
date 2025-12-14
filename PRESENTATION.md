# 🎨 ink-sync
## Real-Time Collaborative Drawing Application

---

## Slide 1: Project Overview

### What is ink-sync?

A **real-time collaborative drawing platform** that enables multiple users to draw together simultaneously on shared canvases.

**Key Features:**
- 🖌️ **Freehand Drawing** - Smooth brush strokes with customizable colors and sizes
- 📐 **Shape Tools** - Rectangles, circles, and lines with drag-and-drop
- 👥 **Real-Time Collaboration** - See other users drawing live via WebSocket
- 🔐 **User Authentication** - Secure JWT-based auth with cookies
- 🗑️ **Image Management** - Create, delete, and manage drawing canvases
- 🎨 **Advanced Controls** - Color picker, opacity slider, and quick size presets

---

## Slide 2: Technology Stack

### Frontend
- **React 19** + **TypeScript** - Modern, type-safe UI
- **React Router v7** - Client-side routing
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for REST API

### Backend
- **Elysia.js** - Fast, modern web framework for Bun
- **Bun** - High-performance JavaScript runtime
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Robust relational database
- **WebSocket** - Real-time bidirectional communication

### Infrastructure
- **Docker Compose** - Containerized development environment
- **nginx** - Reverse proxy with SSL (Let's Encrypt)
- **DynDNS** - Public access via slpersonal.ddns.net

---

## Slide 3: Architecture & Real-Time Features

### Multi-Canvas Architecture
```
┌─────────────────────────────────────┐
│  Event Canvas (transparent)         │ ← Captures user input
├─────────────────────────────────────┤
│  Shape Canvas (transparent)         │ ← Renders shapes + preview
├─────────────────────────────────────┤
│  Stroke Canvas (white background)   │ ← Renders brush strokes
└─────────────────────────────────────┘
```

**Performance Optimization:**
- Separate canvases prevent rendering interference
- Incremental stroke drawing (no full redraws)
- RequestAnimationFrame throttling for shape previews

### Real-Time Collaboration
- **WebSocket Rooms** - Isolated per image ID
- **Authorization** - User access verified via UserImage relation
- **Event Broadcasting** - Draw events synced across all users
- **State Synchronization** - New users receive existing strokes/shapes

---

## Slide 4: Key Features Demo

### 1. Drawing Tools
- **Brush Tool** - Freeform drawing with pointer events
- **Shape Tools** - Rectangle, Circle, Line with live preview
- **Customization**
  - Color picker with recent colors
  - Opacity slider (0-100%)
  - Brush sizes: 1-32px with quick presets

### 2. Collaboration
- **Live Drawing Sync** - See collaborators draw in real-time
- **User Management** - View active users per canvas
- **Room Isolation** - Each image has its own WebSocket room

### 3. Image Management
- **Create Canvas** - Custom dimensions up to 4000x4000px
- **Delete Protection** - Only image owners can delete
- **Access Control** - UserImage join table for permissions

### 4. Data Persistence
- **Database Storage**
  - Paths (strokes) with points
  - Shapes with coordinates and styles
  - User associations
- **Automatic Loading** - Existing drawings loaded on connect

---

## Slide 5: Technical Achievements & Future Plans

### 🏆 Technical Achievements
- ✅ **Optimized Rendering** - Layered canvas architecture for 60fps drawing
- ✅ **Real-Time Sync** - Sub-50ms WebSocket latency for collaborative drawing
- ✅ **Scalable Architecture** - Docker-based deployment ready for production
- ✅ **Type Safety** - Full TypeScript + Prisma type generation
- ✅ **Security** - JWT auth, httpOnly cookies, ownership validation

### 📊 Project Stats
- **Lines of Code:** ~3000+ (Frontend + Backend)
- **Database Models:** 6 (User, Image, Path, Point, Shape, UserImage)
- **API Endpoints:** 15+ REST endpoints + WebSocket server
- **Development Time:** Rapid iteration with modern tooling

### 🚀 Future Enhancements
- 🎭 **Layers System** - Multiple drawing layers with blend modes
- ↩️ **Undo/Redo** - Command pattern for action history
- 💾 **Export** - PNG/SVG export functionality
- 📱 **Mobile Support** - Touch-optimized interface
- 🎨 **More Tools** - Text, eraser, fill bucket, eyedropper
- 👁️ **Cursor Tracking** - Show other users' cursors

---

## Live Demo

**Access the application:**
- 🌐 **URL:** https://slpersonal.ddns.net/ink/
- 📁 **Repository:** github.com/Dependency-Injectors/ink-sync
- 🔧 **Branch:** `feat/shapes` (latest features)

**Demo Highlights:**
1. Create a new canvas
2. Draw with multiple tools
3. Collaborate in real-time
4. Manage shapes and colors

---

## Questions?

**Thank you for your attention!**

🎨 **ink-sync** - Where creativity meets collaboration
