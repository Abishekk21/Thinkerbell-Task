# Full-Stack Application

A modern, scalable full-stack web application foundation built with React, Express, and MongoDB.

## 🚀 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **ES Modules** - Modern JavaScript module system

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands simultaneously
- **Morgan** - HTTP request logger
- **Supertest** - HTTP assertions for testing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local installation) or **MongoDB Atlas** account (cloud database)
- **Git** (optional, for version control)

## 📁 Project Structure

```
project-root/
├── client/                 # React frontend application
│   ├── public/            # Public static assets
│   ├── src/
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable React components
│   │   │   ├── common/    # Generic UI components (Loading, ErrorMessage, etc.)
│   │   │   └── layout/    # Layout components (Navbar, Footer)
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Routing configuration
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Root component
│   │   ├── main.jsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment variables template
│   ├── eslint.config.js   # ESLint configuration
│   ├── vite.config.js     # Vite configuration
│   └── package.json
│
├── server/                # Express backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   ├── database.js      # MongoDB connection
│   │   │   └── environment.js   # Environment validation
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── validators/    # Request validators
│   │   ├── app.js         # Express application setup
│   │   └── server.js      # Server entry point
│   ├── tests/             # Test files
│   ├── .env.example       # Environment variables template
│   ├── eslint.config.js   # ESLint configuration
│   └── package.json
│
├── .gitignore             # Git ignore rules
├── package.json           # Root package configuration
└── README.md              # This file
```

## 🛠️ Installation

### 1. Clone or Navigate to the Project

```powershell
# Windows PowerShell
cd d:\Thinkerbell-task
```

```bash
# macOS/Linux
cd /path/to/Thinkerbell-task
```

### 2. Install Dependencies

Install all dependencies for root, client, and server:

```powershell
# Windows PowerShell
npm run install:all
```

```bash
# macOS/Linux
npm run install:all
```

Or install manually:

```powershell
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
```

### 3. Configure Environment Variables

#### Backend Configuration

Copy the example environment file and configure your settings:

```powershell
# Windows PowerShell
Copy-Item server\.env.example server\.env
```

```bash
# macOS/Linux
cp server/.env.example server/.env
```

Edit `server/.env` and configure:

```env
PORT=5000
NODE_ENV=development

# For local MongoDB (ensure MongoDB is running)
MONGODB_URI=mongodb://localhost:27017/fullstack_app

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fullstack_app?retryWrites=true&w=majority

CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration

Copy the example environment file:

```powershell
# Windows PowerShell
Copy-Item client\.env.example client\.env
```

```bash
# macOS/Linux
cp client/.env.example client/.env
```

The default configuration in `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🗄️ MongoDB Setup

You have two options for MongoDB:

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - Windows: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB:**

   ```powershell
   # Windows (if MongoDB is installed as a service)
   net start MongoDB
   ```

   ```bash
   # macOS/Linux
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod            # Linux
   ```

3. **Verify MongoDB is running:**

   ```powershell
   # Check if MongoDB is listening on port 27017
   Test-NetConnection -ComputerName localhost -Port 27017  # Windows
   ```

   ```bash
   # macOS/Linux
   mongosh --eval "db.adminCommand('ping')"
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create a free account:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster:**
   - Follow the setup wizard
   - Choose the free tier (M0)
   - Select a cloud provider and region

3. **Create a database user:**
   - Go to Database Access
   - Add a new database user with a username and password

4. **Whitelist your IP:**
   - Go to Network Access
   - Add your IP address or use `0.0.0.0/0` for development (allow access from anywhere)

5. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and database name in your `server/.env` file

## ▶️ Running the Application

### Run Full Stack (Frontend + Backend)

```powershell
# From project root
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`

### Run Backend Only

```powershell
npm run dev:server
```

Or directly:

```powershell
cd server
npm run dev
```

### Run Frontend Only

```powershell
npm run dev:client
```

Or directly:

```powershell
cd client
npm run dev
```

## 🔍 API Endpoints

### Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-05-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "database": {
    "connected": true,
    "state": "connected"
  }
}
```

**Status Codes:**
- `200` - Server and database are healthy
- `503` - Server is running but database is disconnected

## 🧪 Testing

### Run All Tests

```powershell
npm test
```

### Run Server Tests Only

```powershell
npm run test:server
```

Or:

```powershell
cd server
npm test
```

### Run Client Tests Only

```powershell
npm run test:client
```

## 🔨 Linting

### Lint All Code

```powershell
npm run lint
```

### Lint Client Only

```powershell
npm run lint:client
```

### Lint Server Only

```powershell
npm run lint:server
```

## 🏗️ Building for Production

Build the frontend for production:

```powershell
npm run build
```

The production build will be created in `client/dist/`.

## 🚨 Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```powershell
   # Windows
   net start MongoDB
   ```
   ```bash
   # macOS
   brew services start mongodb-community
   ```

2. Check if MongoDB is listening on the correct port (27017)

3. Verify `MONGODB_URI` in `server/.env` is correct

4. For MongoDB Atlas:
   - Verify your IP is whitelisted
   - Check username and password are correct
   - Ensure the connection string format is correct

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Stop the process using the port:
   ```powershell
   # Windows
   $process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
   Stop-Process -Id $process -Force
   ```
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. Change the port in `server/.env`:
   ```env
   PORT=5001
   ```

### Environment Variables Not Loading

**Problem:** Application cannot find environment variables

**Solutions:**
1. Ensure `.env` files exist (copy from `.env.example`)
2. Restart the development server
3. Check for typos in variable names
4. Ensure `dotenv` is installed in the server

### CORS Errors

**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Verify `CLIENT_URL` in `server/.env` matches your frontend URL
2. Ensure the frontend is running on the correct port (5173)
3. Check that CORS is properly configured in `server/src/app.js`

## 📚 Development Guidelines

### Adding New Features

1. **Backend Route:** Create in `server/src/routes/`
2. **Controller:** Add handler in `server/src/controllers/`
3. **Service:** Business logic in `server/src/services/`
4. **Model:** Mongoose schema in `server/src/models/`
5. **Frontend Service:** API method in `client/src/services/api.js`
6. **Component:** React component in `client/src/components/` or `client/src/pages/`

### Code Quality

- Run linting before committing: `npm run lint`
- Write tests for new features
- Follow existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow

```powershell
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin main
```

## 🔐 Security Notes

- Never commit `.env` files
- Keep dependencies updated
- Use environment variables for secrets
- Validate all user inputs
- Use HTTPS in production
- Implement authentication/authorization as needed

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/)

## 📝 License

ISC

## 🤝 Contributing

This is a starter foundation. Extend it based on your specific requirements.

---

**Ready to build!** The foundation is set up and ready for your business logic and features.
