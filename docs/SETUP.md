# 🚀 Setup Guide - Integrated Deployment

## Priority-Driven Pharmacy Management System

**Single deployment with MongoDB Atlas (Cloud Database)**

---

## ✅ Prerequisites

- Node.js (v18 or later) - Download from https://nodejs.org/
- MongoDB Atlas account (free tier available)
- Git (optional)

---

## 📦 Step 1: MongoDB Atlas Setup (Cloud Database)

### Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a **free account** (no credit card required)
3. Create a new cluster:
   - Click "Build a Database"
   - Select **FREE Shared** (M0 tier)
   - Choose cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

### Configure Database Access

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username (e.g., `pharma_admin`)
5. Generate or enter a strong password (**SAVE THIS PASSWORD!**)
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to your server's IP address
4. Click "Confirm"

### Get Your Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select driver "Node.js" and version "5.5 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. **SAVE THIS CONNECTION STRING** - you'll need it in Step 3

---

## 🔧 Step 2: Install Dependencies

Open PowerShell and navigate to the project:

```powershell
cd "c:\Users\bhavy\OneDrive\Desktop\Projects\Prescription Manager\server"

# Install backend dependencies
npm install

# Build and integrate frontend
npm run build
```

This will:

- Install all backend dependencies
- Install frontend dependencies
- Build the React frontend
- Integrate it into the backend for single deployment

---

## 🔑 Step 3: Configure Environment Variables

Create your environment file:

```powershell
# Copy the example file
Copy-Item .env.example .env

# Open it with Notepad
notepad .env
```

**Update the .env file with your MongoDB Atlas connection:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
# Replace with your actual connection string from Step 1
MONGODB_URI=your_mongodb_atlas_connection_string_here

# Security
# Generate a secure secret (run: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

**Important:**

- Replace `YOUR_PASSWORD_HERE` with the password you created in Step 1
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Add `?retryWrites=true&w=majority` at the end if you encounter connection issues

Example:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 🌱 Step 4: Seed the Database

Populate the database with test data:

```powershell
npm run seed
```

This will create:

- 3 test users (admin, pharmacist, viewer)
- Sample medicines and batches
- Sample patients
- Sample suppliers

**Test credentials created:**

- Admin: `admin` / `admin123`
- Pharmacist: `pharmacist` / `pharma123`
- Viewer: `viewer` / `view123`

---

## 🚀 Step 5: Start the Application

Start the integrated server:

```powershell
npm start
```

For development with auto-reload:

```powershell
npm run dev
```

✅ **Application running at:** http://localhost:5000

The server now serves both:

- Backend API at: http://localhost:5000/api/\*
- Frontend React app at: http://localhost:5000

---

## 🔐 Step 6: Login and Test

1. Open browser to http://localhost:5000
2. You'll see the clean login page
3. Login with test credentials:
   - Username: `admin`
   - Password: `admin123`
4. Explore the Dashboard and navigation

---

## 📁 Project Structure

```
Prescription Manager/
├── server/                    # Backend + Integrated Frontend
│   ├── src/
│   │   ├── models/           # MongoDB models (10 collections)
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── utils/            # Helpers and utilities
│   │   ├── scripts/
│   │   │   └── seed.js       # Database seeding
│   │   ├── app.js            # Express app configuration
│   │   └── config/           # Database configuration
│   ├── server.js             # Main entry point (serves frontend)
│   ├── package.json          # Dependencies and scripts
│   └── .env                  # Environment variables
├── client/                    # React Frontend (source code)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand state management
│   │   ├── services/         # API services
│   │   └── utils/            # Frontend utilities
│   ├── dist/                 # Built frontend (served by backend)
│   ├── tailwind.config.js    # Pharmacy design system
│   └── package.json
└── docs/                      # Architecture & design docs
    ├── PHASE-1-ARCHITECTURE.md
    └── PHASE-2-UI-UX-DESIGN.md
```

---

## 🎨 Design System

**Colors:**

- Primary Green: `#2F6F4E` (pharmacy green)
- Warning Amber: `#C56A1A` (amber)
- Error Red: `#C53030`
- Success Green: `#38A169`

**Design Principles:**

- ✅ Clean, hospital-grade aesthetic
- ✅ Professional typography (Inter font)
- ✅ No gradients or flashy animations
- ✅ Accessible and auditable

---

## 🛠️ Available NPM Scripts

From the `server/` directory:

```powershell
npm start              # Start production server (serves integrated app)
npm run dev           # Start development server with auto-reload
npm run build         # Build and integrate frontend
npm run seed          # Seed database with test data
npm test              # Run tests (when implemented)
```

---

## 🔍 Troubleshooting

### MongoDB Atlas Connection Issues

**Error: "MongoServerError: bad auth"**

- Double-check your username and password in MONGODB_URI
- Make sure password doesn't contain special characters that need URL encoding
- If password has special chars, encode them: `@` → `%40`, `#` → `%23`, etc.

**Error: "connect ETIMEDOUT"**

- Check Network Access settings in MongoDB Atlas
- Ensure "Allow Access from Anywhere" (0.0.0.0/0) is enabled
- Check your firewall/antivirus isn't blocking MongoDB connections

**Error: "Authentication failed"**

- Verify the database user was created with correct privileges
- Wait a few minutes after creating user (propagation delay)

### Frontend Not Loading

**Error: "Cannot GET /"**

- Make sure you ran `npm run build` first
- Check that `client/dist` folder exists
- Restart the server after building

**Blank page or 404 errors**

- Check browser console for errors
- Verify server.js has the static file serving middleware
- Try clearing browser cache

### Server Won't Start

**Error: "Port 5000 already in use"**

```powershell
# Find and kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or change the port in .env:
PORT=5001
```

**Error: "Module not found"**

```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Seed Script Fails

**Error: "Models are not defined"**

- Make sure MongoDB Atlas connection is working
- Check that MONGODB_URI in .env is correct
- Verify database user has write permissions

---

## 📚 Data Structures & Algorithms Implemented

This project demonstrates 6 key DSA concepts:

1. **Hash Tables** - O(1) medicine lookup by ID
2. **Linked Lists** - Prescription items chaining
3. **Priority Queues** - Patient urgency handling (min-heap)
4. **FIFO Queues** - Fair prescription processing
5. **Greedy Algorithms** - Stock allocation (first-expiry-first-out)
6. **Append-Only Logs** - Audit trail (immutable history)

See `docs/PHASE-1-ARCHITECTURE.md` for detailed implementations.

---

## 🚀 Deployment Ready

This integrated setup is deployment-ready for:

- **Render** (recommended for Node.js)
- **Heroku**
- **Railway**
- **Fly.io**
- **DigitalOcean App Platform**

All you need:

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
4. Deploy!

MongoDB Atlas works perfectly with all cloud hosting platforms.

---

## 📞 Support

If you encounter issues:

1. Check MongoDB Atlas dashboard (Database → Browse Collections)
2. Review server logs in PowerShell
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly

---

## ✨ Next Steps

After setup, continue development:

- [ ] Complete Inventory page with CRUD operations
- [ ] Build Prescriptions page with linked list
- [ ] Implement Queue page with priority queue
- [ ] Create Dispense page with greedy allocation
- [ ] Add History/Audit page with append-only logs
- [ ] Connect all API endpoints
- [ ] Add PDF bill generation
- [ ] Implement CSV import/export

Enjoy building! 🎉
