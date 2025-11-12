# ink-sync

[//]: # (Shields)
[![version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://img.shields.io/)
[![build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://img.shields.io/)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/)

Ink-Sync is a collaborative drawing app: a React frontend with an Elysia.js backend, Postgres for persistence, and WebSockets for real-time shared canvas drawing.

## Key features
- Real-time collaborative drawing via WebSockets
- React frontend with an interactive canvas
- Elysia.js backend handling sessions, persistence, and socket events
- Postgres for durable storage of sessions/boards
- Simple protocol to broadcast strokes and state diffs

## Tech stack
- Frontend: React (Canvas, WebSocket client)
- Backend: Elysia.js (WebSocket server + REST API)
- Database: PostgreSQL
- Realtime: WebSockets

## Quick start (development)
Prerequisites:
- Node.js (16+), npm or pnpm
- PostgreSQL

1. Configure environment
   - Create a Postgres DB and user
   - Set env vars (example):
     - DATABASE_URL=postgres://user:pass@localhost:5432/ink_sync
     - BACKEND_PORT=4000
     - FRONTEND_PORT=3000
2. Start backend (Elysia)
   - cd backend
   - npm install
   - npm run dev
3. Start frontend (React)
   - cd frontend
   - npm install
   - npm start
4. Open the frontend in multiple browser windows to draw together.

## Database
- Use Postgres for sessions/boards. Run migrations if present before starting the backend.
- Store stroke data as compact events (JSON) to minimize DB size and allow replay.

## Architecture (high level)
- Clients connect to backend via WebSocket.
- Client sends stroke events (start, move, end).
- Backend broadcasts stroke events to other clients in the same session and optionally persists them to Postgres.
- New clients can request current board state (replay of stored events).

## Contributing
- Open issues and PRs for features, bugs, or performance improvements.
- Keep messages/events compact and debounced for network efficiency.

## License
MIT

[Open this README file in the workspace](/home/sven/Schreibtisch/ink-sync/README.md)