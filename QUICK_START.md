# Quick Start Guide

Get your full-stack application running in minutes.

## Prerequisites

- Node.js (v18+) installed
- MongoDB running locally OR MongoDB Atlas account

## Step 1: Install Dependencies (Already Done ✓)

Dependencies are already installed. If you need to reinstall:

```powershell
npm run install:all
```

## Step 2: Configure MongoDB

Choose one option:

### Option A: Local MongoDB

1. **Install MongoDB**: Download from https://www.mongodb.com/try/download/community

2. **Start MongoDB**:
   ```powershell
   # Windows
   net start MongoDB
   ```

3. **Verify**:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 27017
   ```

4. **Configuration**: The default `server/.env` already uses:
   ```
   MONGODB_URI=mongodb://localhost:27017/fullstack_app
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create account**: https://www.mongodb.com/cloud/atlas

2. **Create cluster**: Choose M0 Free tier

3. **Create database user**: Remember username and password

4. **Whitelist IP**: Add `0.0.0.0/0` for development

5. **Get connection string**: Click "Connect" → "Connect your application"

6. **Update `server/.env`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fullstack_app?retryWrites=true&w=majority
   ```

## Step 3: Start the Application

```powershell
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Step 4: Verify

Open your browser to http://localhost:5173

You should see:
- ✅ Home page with API status
- ✅ Green "API Connected" badge
- ✅ Database status showing "Connected"

## Troubleshooting

### MongoDB Not Connected?

**Check 1**: Is MongoDB running?
```powershell
# Windows
Get-Service MongoDB  # Should show "Running"
```

**Check 2**: Is the connection string correct?
```powershell
# Check server/.env file
Get-Content server\.env
```

**Check 3**: View server logs in terminal for error messages

### Port Already in Use?

Change the port in `server/.env`:
```env
PORT=5001
```

### Frontend Not Loading?

1. Check if Vite dev server is running (should see output in terminal)
2. Try http://localhost:5173 directly
3. Check browser console for errors

## Common Commands

```powershell
# Start both frontend and backend
npm run dev

# Start backend only
npm run dev:server

# Start frontend only
npm run dev:client

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## What's Next?

1. **Add Models**: Create Mongoose schemas in `server/src/models/`
2. **Add Routes**: Define new API endpoints in `server/src/routes/`
3. **Add Controllers**: Handle requests in `server/src/controllers/`
4. **Add Services**: Business logic in `server/src/services/`
5. **Add Pages**: New React pages in `client/src/pages/`
6. **Add Components**: Reusable UI in `client/src/components/`

## Project Structure Overview

```
Thinkerbell-task/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API services
│   │   └── routes/       # Route configuration
│   └── package.json
│
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   └── config/       # Configuration
│   └── package.json
│
└── README.md        # Full documentation
```

## Support

For detailed documentation, see `README.md`

For verification details, see `SETUP_VERIFICATION.md`

---

**You're all set! Happy coding! 🚀**
