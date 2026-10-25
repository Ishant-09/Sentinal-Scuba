# GuildUp — Multiplayer Study Sanctuaries & Quest Engine

GuildUp is a gamified full-stack multiplayer collaborative study platform. It combines RPG quest progression, real-time study sanctuaries, synchronized Pomodoro chambers, party voice/chat, and a real-time collaborative whiteboard.

---

## 🌟 Key Features

- **🏰 Guild Sanctum Login**: Instant username authentication, creating adventurer profiles on the fly without complex friction.
- **📜 Quest & Curriculum Progression Board**: Complete trial milestones, earn XP for yourself and your guild, and trigger level-ups with celebration animations.
- **🎨 Live Collaborative Whiteboard**: Real-time cross-device drawing sync (pen, highlighter, eraser, pencil, shapes, and sticky notes) with normalized coordinate scaling across all screen sizes.
- **⏱️ Synchronized Pomodoro Study Chambers**: Keep focused together with countdown timers synchronized across every device in the room.
- **💬 Real-Time Party Chat & Activity Feed**: Real-time messaging, typing indicators, reactions, and live presence tracking.
- **🐉 Boss Raid Encounters**: Party-wide encounters against the Query Devourer with coordinated attacks and health sync.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- *(Optional for database persistence)*: **PostgreSQL** & **Redis**

### 2. Installation
Clone the repository and install all dependencies:
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_REPO_NAME>

# Install both frontend & backend dependencies
npm run install:all
```

*(Or install separately:)*
```bash
npm install
npm --prefix server install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

### 4. Running the Website
Start both the Frontend (Vite) and Backend (Node / Express / Socket.io) with a single command:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API & WebSockets**: `http://localhost:4000`
- **Local Network Access (Multiple Devices / Phones)**: `http://<YOUR_LOCAL_IP>:3000`

---

## 🛠️ Project Architecture

```
├── src/                          # Frontend Application (React + TypeScript + Tailwind)
│   ├── api/                      # REST API client & fetch wrappers
│   ├── components/               # UI components
│   │   ├── auth/                 # Guild Sanctum Login Page
│   │   ├── guild/                # Active Quests & Guild Hall cards
│   │   ├── layout/               # TopNavbar, LeftSidebar, RightSidebar, Footer
│   │   ├── modals/               # Quest detail, guild join, whisper popups
│   │   ├── study/                # Focus chamber, whiteboard, screen share, notes
│   │   └── views/                # Full-page views (Guild Hall, Quests, Arena, etc.)
│   ├── realtime/                 # Socket.io client & event hooks
│   └── types/                    # Shared domain TypeScript interfaces
├── server/                       # Backend Application (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── modules/              # Domain modules (auth, quests, studyRooms, etc.)
│   │   ├── realtime/             # Socket.io server handlers & room broadcasting
│   │   └── lib/                  # Database, Redis, and logger clients
│   └── prisma/                   # PostgreSQL schema & migrations
└── scripts/
    └── dev.js                    # Orchestrates simultaneous Vite + Express dev servers
```

---

## 📦 Production Deployment

To run in production (keeping the server running 24/7):

### Option A: Using PM2 (Background Daemon)
```bash
# Install PM2 globally
npm install -g pm2

# Build frontend and backend
npm run build:all

# Start as a managed background process
pm2 start scripts/dev.js --name "guildup"

# Make it start on system reboot
pm2 startup
pm2 save
```

### Option B: Cloud Hosting (Render / Railway)
- **Frontend**: Deploy `dist/` to Vercel or Netlify.
- **Backend**: Deploy `server/` to Render, Railway, or Fly.io with PostgreSQL and Redis addons.
