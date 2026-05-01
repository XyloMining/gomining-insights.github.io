# GoMining Crypto Insights - Running the Project

This document provides instructions on how to run the GoMining Crypto Insights development server.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - Install with: `npm install -g pnpm`

## Quick Start

### Option 1: Using Batch File (Windows)

1. Navigate to the project folder in Command Prompt
2. Double-click `run.bat` or run:
   ```cmd
   run.bat
   ```
3. The development server will start at `http://localhost:3000`

### Option 2: Using PowerShell Script (Windows)

1. Open PowerShell in the project folder
2. Run:
   ```powershell
   .\run.ps1
   ```
3. The development server will start at `http://localhost:3000`

### Option 3: Manual Command

1. Open Command Prompt or PowerShell in the project folder
2. Install dependencies (first time only):
   ```cmd
   pnpm install
   ```
3. Start the development server:
   ```cmd
   pnpm dev
   ```
4. The development server will start at `http://localhost:3000`

## Project Structure

```
gomining-crypto-insights/
├── client/                    # React frontend
│   └── src/
│       ├── pages/            # Page components
│       │   ├── Home.tsx       # Home page
│       │   ├── BlogArchive.tsx # Blog archive (all posts)
│       │   ├── BlogLatest.tsx  # Latest blog post
│       │   ├── BlogPost.tsx    # Individual blog post by date
│       │   ├── AdminDashboard.tsx # Admin dashboard
│       │   └── ...
│       └── components/        # Reusable components
├── server/                    # Express backend
│   ├── _core/                # Core server logic
│   └── routers/              # API routers
├── run.bat                   # Batch file to run the project
├── run.ps1                   # PowerShell script to run the project
└── package.json              # Project configuration
```

## Available Routes

### Public Routes

- `/` - Home page
- `/blog` - Blog archive (all posts)
- `/blog/latest` - Latest blog post
- `/blog/YYYY-MM-DD` - Individual blog post by date (e.g., `/blog/2026-04-30`)
- `/login` - User login/signup
- `/login/admin` - Admin login

### Admin Routes

- `/admin/dashboard` - Admin dashboard (requires admin login)

## Admin Login

To access the admin dashboard:

1. Navigate to `http://localhost:3000/login/admin`
2. Use the credentials from your `.env` file:
   - **Username**: `admin`
   - **Secret**: `c8d3f7ca900e8e8a4318125eb2177fea0af3fa0f211a6140` (or your configured secret)

## Admin Dashboard Features

### Site Controls

- **Show GoMining nav link** - Toggle the GoMining link in the navigation
- **Show ad blocks** - Toggle advertisement display
- **Home CTA text** - Customize the call-to-action text on the home page

### Blog Management

- **Post Blog Update** - Publish new blog posts with:
  - Title
  - Excerpt
  - Content (Markdown supported)
  - Image URL (optional)

## Blog Post URLs

Blog posts are accessed using the date they were published:

- Latest post: `/blog/latest`
- Specific post: `/blog/2026-04-30` (YYYY-MM-DD format)
- All posts: `/blog`

## Stopping the Server

Press `Ctrl+C` in the terminal/command prompt to stop the development server.

## Troubleshooting

### pnpm not found

If you get "pnpm is not installed or not in PATH", install it globally:
```cmd
npm install -g pnpm
```

### Port 3000 already in use

If port 3000 is already in use, you can specify a different port:
```cmd
pnpm dev -- --port 3001
```

### Dependencies not installing

Try clearing the pnpm cache and reinstalling:
```cmd
pnpm store prune
pnpm install
```

## Support

For issues or questions, please check the project documentation or contact the development team.
