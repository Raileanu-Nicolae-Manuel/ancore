# Ancore Implementation Plan

> A Discord/Mattermost-like desktop app with real-time messaging and video/voice calls

## Tech Stack

### Client (Electron + React)
- **Framework**: Electron + React + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query + Hono RPC Client
- **Local DB**: SQLite + Drizzle ORM
- **Real-time**: WebSocket client + WebRTC

### Server (Hono)
- **Framework**: Hono (with RPC export)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (email/password)
- **Real-time**: WebSocket + WebRTC signaling

---

## Phase 1: Project Foundation

### 1.1 Monorepo Setup
- [ ] Initialize pnpm workspace in root
- [ ] Create `pnpm-workspace.yaml` with app, server, packages/*
- [ ] Create shared packages:
  - `packages/shared-types` — Shared TypeScript types
  - `packages/db-schema` — Drizzle schema (used by both server and client cache)
- [ ] Configure root `tsconfig.json` with path aliases
- [ ] Add root scripts for dev, build, lint

### 1.2 Server Initialization
- [ ] Initialize Hono project in `server/`
- [ ] Set up folder structure:
  ```
  server/
  ├── src/
  │   ├── index.ts          # Entry point
  │   ├── app.ts            # Hono app instance
  │   ├── routes/           # API routes
  │   ├── middleware/       # Auth, logging, etc.
  │   ├── db/
  │   │   ├── index.ts      # Drizzle client
  │   │   ├── schema.ts     # Database schema
  │   │   └── migrations/   # Drizzle migrations
  │   ├── services/         # Business logic
  │   ├── websocket/        # WS handlers
  │   └── webrtc/           # Signaling logic
  ├── drizzle.config.ts
  └── package.json
  ```
- [ ] Install dependencies: hono, drizzle-orm, postgres, better-auth, zod
- [ ] Configure Drizzle with PostgreSQL
- [ ] Create health check endpoint
- [ ] Set up environment variables (.env)

### 1.3 Electron App Initialization
- [ ] Initialize Electron + React + Vite in `app/`
- [ ] Set up folder structure:
  ```
  app/
  ├── src/
  │   ├── main/             # Electron main process
  │   │   ├── index.ts
  │   │   ├── ipc/          # IPC handlers
  │   │   └── cache/        # SQLite cache logic
  │   ├── preload/          # Preload scripts
  │   ├── renderer/         # React app
  │   │   ├── App.tsx
  │   │   ├── components/
  │   │   ├── pages/
  │   │   ├── hooks/
  │   │   ├── lib/
  │   │   │   ├── api.ts    # Hono RPC client
  │   │   │   ├── ws.ts     # WebSocket client
  │   │   │   └── webrtc.ts # WebRTC logic
  │   │   └── stores/
  │   └── shared/           # Shared between main/renderer
  ├── electron.vite.config.ts
  └── package.json
  ```
- [ ] Install dependencies: electron, vite, react, @tanstack/react-query, hono/client
- [ ] Configure electron-vite for build
- [ ] Set up IPC bridge between main and renderer

---

## Phase 2: Authentication

### 2.1 Server Auth Setup
- [ ] Configure Better Auth with email/password provider
- [ ] Create auth routes:
  - `POST /auth/register` — Create account
  - `POST /auth/login` — Login, return session
  - `POST /auth/logout` — Invalidate session
  - `GET /auth/me` — Get current user
- [ ] Implement session middleware for protected routes
- [ ] Add user table to Drizzle schema

### 2.2 Client Auth Integration
- [ ] Create auth pages: Login, Register
- [ ] Set up Hono RPC client with auth headers
- [ ] Implement auth state management
- [ ] Add protected route wrapper
- [ ] Store session token securely (electron-store or keychain)

---

## Phase 3: Core Database Schema

### 3.1 Server Database Schema
- [ ] Users table (id, email, passwordHash, displayName, avatarUrl, status, createdAt)
- [ ] Servers table (id, name, iconUrl, ownerId, inviteCode, createdAt)
- [ ] Channels table (id, serverId, name, type: text/voice, position, createdAt)
- [ ] Members table (id, userId, serverId, role, joinedAt)
- [ ] Messages table (id, channelId, authorId, content, attachments, createdAt, updatedAt)
- [ ] Set up relations and indexes
- [ ] Generate and run initial migration

### 3.2 Client Cache Schema
- [ ] Mirror relevant tables for local SQLite cache
- [ ] Add sync metadata (lastSyncedAt, isSynced)
- [ ] Set up Drizzle for SQLite in main process

---

## Phase 4: Server & Channel APIs

### 4.1 Server Management APIs
- [ ] `GET /servers` — List user's servers
- [ ] `POST /servers` — Create server
- [ ] `GET /servers/:id` — Get server details
- [ ] `PATCH /servers/:id` — Update server (owner only)
- [ ] `DELETE /servers/:id` — Delete server (owner only)
- [ ] `POST /servers/:id/join` — Join via invite code
- [ ] `POST /servers/:id/leave` — Leave server
- [ ] `GET /servers/:id/members` — List members

### 4.2 Channel Management APIs
- [ ] `GET /servers/:id/channels` — List channels
- [ ] `POST /servers/:id/channels` — Create channel
- [ ] `PATCH /channels/:id` — Update channel
- [ ] `DELETE /channels/:id` — Delete channel

### 4.3 Message APIs
- [ ] `GET /channels/:id/messages` — Get messages (paginated)
- [ ] `POST /channels/:id/messages` — Send message
- [ ] `PATCH /messages/:id` — Edit message
- [ ] `DELETE /messages/:id` — Delete message

### 4.4 Export Hono RPC Types
- [ ] Export route types for client consumption
- [ ] Create shared types package with API types

---

## Phase 5: Real-time WebSocket Layer

### 5.1 Server WebSocket Setup
- [ ] Integrate WebSocket with Hono (using hono/websocket or ws)
- [ ] Implement connection authentication
- [ ] Create event types:
  - `message:new` — New message in channel
  - `message:update` — Message edited
  - `message:delete` — Message deleted
  - `user:presence` — User online/offline/away
  - `user:typing` — Typing indicator
  - `channel:update` — Channel changes
  - `member:join` / `member:leave`
- [ ] Implement room/channel subscription system
- [ ] Handle connection lifecycle (connect, disconnect, reconnect)

### 5.2 Client WebSocket Integration
- [ ] Create WebSocket client wrapper
- [ ] Implement auto-reconnect logic
- [ ] Sync WebSocket events with TanStack Query cache
- [ ] Handle typing indicators
- [ ] Implement presence system

---

## Phase 6: Client UI Components

### 6.1 Layout Components
- [ ] Main app layout (sidebar + content area)
- [ ] Server list sidebar (vertical icon list)
- [ ] Channel sidebar (channel list + server header)
- [ ] User panel (bottom of sidebar, current user info)

### 6.2 Auth Components
- [ ] Login form
- [ ] Register form
- [ ] Server connection screen (enter server URL for self-hosted)

### 6.3 Server Components
- [ ] Server icon component
- [ ] Create server modal
- [ ] Join server modal (invite code)
- [ ] Server settings modal

### 6.4 Channel Components
- [ ] Channel list item
- [ ] Create channel modal
- [ ] Channel header

### 6.5 Message Components
- [ ] Message list (virtualized for performance)
- [ ] Message item (avatar, content, timestamp)
- [ ] Message input (with attachment button)
- [ ] Typing indicator
- [ ] Message actions (edit, delete)

### 6.6 User Components
- [ ] User avatar
- [ ] User profile popover
- [ ] Member list sidebar
- [ ] Presence indicator (online/offline dot)

---

## Phase 7: Local Cache System

### 7.1 Cache Architecture
- [ ] Set up SQLite database in Electron main process
- [ ] Initialize Drizzle ORM for SQLite
- [ ] Create IPC handlers for cache operations

### 7.2 Cache Sync Logic
- [ ] Implement cache-first strategy with background sync
- [ ] On app start: load from cache, then fetch updates
- [ ] On new data: update cache and UI simultaneously
- [ ] Handle conflict resolution (server wins)
- [ ] Implement message queue for offline actions

### 7.3 Cache Queries (IPC)
- [ ] Get cached servers/channels/messages
- [ ] Store received data in cache
- [ ] Clear cache on logout
- [ ] Cache invalidation on server events

---

## Phase 8: Video/Voice Calls

### 8.1 WebRTC Signaling Server
- [ ] Create signaling events:
  - `call:initiate` — Start a call
  - `call:offer` — Send SDP offer
  - `call:answer` — Send SDP answer
  - `call:ice-candidate` — Exchange ICE candidates
  - `call:end` — End call
  - `call:reject` — Reject incoming call
- [ ] Track active calls per channel/user
- [ ] Handle call state management

### 8.2 Client WebRTC Implementation
- [ ] Create WebRTC service class
- [ ] Implement peer connection setup
- [ ] Handle media streams (camera, microphone, screen share)
- [ ] Implement ICE candidate exchange
- [ ] Handle connection state changes

### 8.3 Call UI Components
- [ ] Incoming call modal
- [ ] Call controls (mute, camera, screen share, end)
- [ ] Video grid layout
- [ ] Picture-in-picture mode
- [ ] Voice channel UI in channel list

### 8.4 Voice Channels
- [ ] Join voice channel functionality
- [ ] Show connected users in voice channel
- [ ] Voice activity indicator
- [ ] Implement 1-on-1 calls first
- [ ] Plan for group calls (SFU integration later)

---

## Phase 9: File Uploads

### 9.1 Server File Handling
- [ ] Create uploads directory
- [ ] `POST /upload` — Upload file endpoint
- [ ] `GET /files/:id` — Serve files
- [ ] Store file metadata in database
- [ ] Implement file size limits
- [ ] Generate thumbnails for images

### 9.2 Client Upload Integration
- [ ] File picker in message input
- [ ] Upload progress indicator
- [ ] Image/video preview in messages
- [ ] File download handling

---

## Phase 10: Polish & Enhancements

### 10.1 Notifications
- [ ] System notifications for new messages
- [ ] Call notifications (ring)
- [ ] Notification preferences

### 10.2 User Settings
- [ ] Profile settings (display name, avatar)
- [ ] Notification settings
- [ ] Audio/video device selection
- [ ] Theme settings (dark/light)

### 10.3 Message Features
- [ ] Message editing
- [ ] Message deletion
- [ ] Emoji reactions (future)
- [ ] Message search (future)

### 10.4 Performance
- [ ] Message virtualization
- [ ] Image lazy loading
- [ ] Optimize cache queries
- [ ] Bundle optimization

---

## Current Progress

- [ ] Phase 1: Project Foundation
- [ ] Phase 2: Authentication
- [ ] Phase 3: Core Database Schema
- [ ] Phase 4: Server & Channel APIs
- [ ] Phase 5: Real-time WebSocket Layer
- [ ] Phase 6: Client UI Components
- [ ] Phase 7: Local Cache System
- [ ] Phase 8: Video/Voice Calls
- [ ] Phase 9: File Uploads
- [ ] Phase 10: Polish & Enhancements

---

## Notes

- Start with 1-on-1 calls; group calls require SFU (Selective Forwarding Unit) like mediasoup or LiveKit
- Docker deployment will be added separately after core features
- Self-hosted server discovery: client stores server URL, connects via Hono RPC
