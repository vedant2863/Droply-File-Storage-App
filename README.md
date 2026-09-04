This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# Droply - Cloud File Storage Platform

**Droply** is a high-performance cloud file storage and folder management platform built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, **Docker Compose PostgreSQL 16**, **Drizzle ORM**, and **ImageKit CDN**.

---

## Key Features

### 1. 🔐 Authentication & Session Security
- **Dual-Token JWT Architecture**:
  - **Access Token (15 min)**: Rapid authentication verified using `jose` on every request.
  - **Refresh Token (7 days)**: Stored in PostgreSQL (`refresh_tokens` table) with automatic rotation on use and instant revocation on sign-out.
  - **HttpOnly Cookies**: Strict `SameSite=Lax`, `HttpOnly` cookies safeguarding against XSS and token interception.
- **Route Protection via Next.js 16 Proxy (`proxy.ts`)**:
  - Automatically guards `/dashboard` and internal `/api/files` endpoints.
  - Redirects unauthenticated traffic to `/sign-in`.
  - Redirects authenticated users away from auth pages to `/dashboard`.
- **User Account Management**:
  - Secure registration (`/sign-up`) with `bcryptjs` password hashing.
  - User profile and storage statistics (`/dashboard/profile`).

### 2. 📁 File & Folder Hierarchy
- **Nested Folder System**: Unlimited depth parent-child folder tree (`parentId` hierarchy).
- **Interactive Breadcrumb Trail**: One-click navigation back to root or any parent directory.
- **ImageKit Cloud Storage**: Direct client-signed CDN uploads via `/api/imagekit-auth`.
- **Dynamic File Icons**: Visual color-coded icons for images, PDFs, videos, audio, code, archives, and documents.
- **In-App Rich Previews**: Interactive preview modals for images, PDFs, video/audio playback, and code syntax viewer.

### 3. ⭐ Workflow & File State Management
- **Tab-Based Organization**:
  - **All Files**: Directory browsing with nested folders.
  - **Starred**: Quick access to bookmarked critical files.
  - **Trash**: Quarantine view for deleted files.
- **Cascading Soft Delete & Restore**: Moving a folder to Trash cascades trash state to all descendant items.
- **Permanent Purge & ImageKit Cleanup**: Permanently removes records from PostgreSQL and dispatches bulk deletion calls to ImageKit CDN storage.
- **Empty Trash**: One-click bulk purge with safety confirmation dialog.

### 4. 📦 Batch Operations & Hierarchical ZIP Download
- **Multi-Select Table**: Checkbox columns with "Select All" toggle.
- **Contextual Batch Action Bar**:
  - **Download ZIP**: Uses `JSZip` to recursively traverse and package selected files and nested folder subdirectories into a structured `.zip` archive.
  - **Batch Star / Unstar**
  - **Batch Move to Trash / Restore**
  - **Batch Permanent Delete**
- **High-Performance Batch API (`/api/files/batch`)**: Executes bulk actions in single SQL queries (`inArray`).

### 5. 🎨 Modern UI & Responsive Design
- **Tailwind CSS v4** with class-based light/dark theme support via `next-themes`.
- **Centralized Types**: Full TypeScript type safety with dedicated `/types` directory.
- **Centralized Frozen Configuration**: `config/env.ts` exporting an immutable `ENV` object.

---

## Tech Stack

- **Framework**: Next.js 16.3.4 (App Router, Turbopack, `proxy.ts`)
- **UI Library**: React 19, Tailwind CSS v4, Lucide React, Next-Themes
- **Database**: PostgreSQL 16 Alpine via Docker Compose (Port 5433)
- **ORM & Driver**: Drizzle ORM + postgres.js
- **Auth**: Custom JWT (`jose`) + `bcryptjs`
- **Cloud Storage**: ImageKit CDN
- **Archiving**: JSZip

---

## Getting Started

First, run the development server:
### 1. Clone the Repository
```bash
git clone https://github.com/vedant2863/Droply-File-Storage-App.git
cd Droply-File-Storage-App
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
cp .env.example .env.local
```
Ensure your database URL points to port `5433`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/droply
JWT_ACCESS_SECRET=droply_jwt_access_super_secret_development_key_32chars!
JWT_REFRESH_SECRET=droply_jwt_refresh_super_secret_development_key_32chars!
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
### 3. Start Local PostgreSQL Database
```bash
docker compose up -d
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
### 4. Install Dependencies
```bash
npm install
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
### 5. Push Schema & Seed Demo Data
```bash
npm run db:push
npm run db:seed
```

## Learn More
Demo account credentials:
- **Email**: `demo@droply.com`
- **Password**: `password123`

To learn more about Next.js, take a look at the following resources:
### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
---

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
## Available Scripts

## Deploy on Vercel
- `npm run dev`: Start Next.js development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run db:push`: Push Drizzle schema directly to PostgreSQL
- `npm run db:generate`: Generate migration SQL files
- `npm run db:studio`: Open Drizzle Studio database viewer
- `npm run db:seed`: Seed database with demo account and sample folders
- `npm run lint`: Run ESLint checks

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
---

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## License
MIT
