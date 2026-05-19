# SmartBuy - Full-Stack App

A comprehensive ordering system for restaurants and supermarkets with QR ordering, kiosk support, admin dashboard, and real-time kitchen displays.

## Quick Start

1. Install root dependencies (concurrently):
   ```bash
   npm install
   ```
2. Start both the frontend and backend servers simultaneously:
   ```bash
   npm start
   ```

## Services

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:4000`
- **SQLite Database**: `prisma/dev.db`

## Key URLs

- **Customer App**: `http://localhost:5173`
- **Kitchen Display System (KDS)**: `http://localhost:5173/kitchen`
- **Token Display TV**: `http://localhost:5173/token-display`
- **Kiosk Machine**: `http://localhost:5173/kiosk`
- **Admin Dashboard**: `http://localhost:5173/admin`

> **Note:** The backend uses an SQLite database by default so it works out-of-the-box on your machine without requiring Postgres setup.

## Stack
- Frontend: React 18, Vite, Zustand, TailwindCSS, Socket.io-client
- Backend: Node.js, Express, Socket.io, Prisma, SQLite
