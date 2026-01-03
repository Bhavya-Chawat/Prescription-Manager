# Priority-Driven Pharmacy Management System

A complete, production-ready pharmacy management web application built with MERN stack (MongoDB Atlas, Express.js, React, Node.js) demonstrating core Data Structures & Algorithms.

## 🚀 Features

- **Integrated Deployment** - Single Node.js server serves both frontend and backend
- **Cloud Database** - MongoDB Atlas (no local database needed)
- **Professional UI** - Clean, hospital-grade design with pharmacy colors
- **Authentication** - JWT-based with role-based access (Admin, Pharmacist, Viewer)
- **DSA Implementation** - 6 algorithms: Hash Tables, Linked Lists, Priority Queues, FIFO Queues, Greedy Algorithms, Append-Only Logs

## 🎨 Design System

- **Primary Green**: `#2F6F4E` (pharmacy green)
- **Warning Amber**: `#C56A1A`
- **Typography**: Inter font family
- **Style**: Clean, professional, hospital-grade aesthetic
- **No gradients, no flashy animations**

## 🏗️ Tech Stack

### Backend

- Node.js + Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose ODM
- JWT Authentication
- Zod Validation
- bcryptjs Password Hashing

### Frontend

- React 18 + Vite
- Tailwind CSS (Custom Pharmacy Theme)
- Zustand (State Management)
- Axios (HTTP Client)
- Lucide React (Icons)

## 📦 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)

### Setup

1. **Clone or extract the project**

```powershell
cd "c:\Users\bhavy\OneDrive\Desktop\Projects\Prescription Manager\server"
```

2. **Install dependencies**

```powershell
npm install
```

3. **Build frontend**

```powershell
npm run build
```

4. **Create MongoDB Atlas cluster** (see [SETUP.md](SETUP.md) for detailed steps)

   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create free M0 cluster
   - Create database user
   - Allow network access (0.0.0.0/0 for dev)
   - Get connection string

5. **Configure environment**

```powershell
Copy-Item .env.example .env
notepad .env
```

Update with your MongoDB Atlas connection:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pharmacy_management
JWT_SECRET=your-secret-key
PORT=5000
```

6. **Seed database**

```powershell
npm run seed
```

7. **Start application**

```powershell
npm start
```

Visit: http://localhost:5000

### Test Credentials

- Admin: `admin` / `admin123`
- Pharmacist: `pharmacist` / `pharma123`
- Viewer: `viewer` / `view123`

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with MongoDB Atlas instructions
- **[docs/PHASE-1-ARCHITECTURE.md](docs/PHASE-1-ARCHITECTURE.md)** - System architecture and DSA implementations
- **[docs/PHASE-2-UI-UX-DESIGN.md](docs/PHASE-2-UI-UX-DESIGN.md)** - UI/UX design specifications

## 🗂️ Project Structure

```
Prescription Manager/
├── server/                    # Backend (serves integrated app)
│   ├── src/
│   │   ├── models/           # 10 MongoDB models
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── utils/            # Helpers and utilities
│   │   └── scripts/
│   │       └── seed.js       # Database seeding
│   ├── server.js             # Main entry (serves frontend)
│   └── package.json
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # UI components (9 professional components)
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand state management
│   │   └── services/         # API services
│   ├── dist/                 # Built frontend (served by backend)
│   └── tailwind.config.js    # Custom pharmacy design system
└── docs/                      # Architecture documentation
```

## 🎯 Data Structures & Algorithms

### Implemented

1. **Hash Tables** - O(1) medicine lookup by ID/barcode
2. **Linked Lists** - Prescription item chaining
3. **Priority Queues (Min-Heap)** - Patient urgency handling
4. **FIFO Queues** - Fair prescription processing
5. **Greedy Algorithms** - Stock allocation (first-expiry-first-out)
6. **Append-Only Logs** - Immutable audit trail

### Code Locations

See [docs/PHASE-1-ARCHITECTURE.md](docs/PHASE-1-ARCHITECTURE.md) for detailed implementations with code examples.

## 🔧 NPM Scripts

```powershell
npm start         # Start production server
npm run dev       # Start with auto-reload (nodemon)
npm run build     # Build and integrate frontend
npm run seed      # Populate database with test data
npm test          # Run tests
```

## 🌐 Deployment

Ready to deploy on:

- Render (recommended)
- Heroku
- Railway
- Fly.io
- DigitalOcean App Platform

**Steps:**

1. Push to GitHub
2. Connect repository to hosting platform
3. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`
4. Deploy!

MongoDB Atlas works with all cloud platforms - no local database needed.

## 📱 Core Features

- ✅ **Dashboard** - Metrics and system overview
- 🚧 **Inventory** - Medicine stock management with CRUD operations
- 🚧 **Prescriptions** - Prescription entry and management
- 🚧 **Queue** - Priority-based patient queue (min-heap)
- 🚧 **Dispense** - Medicine dispensing with greedy allocation
- 🚧 **History** - Audit trail with append-only logs
- ✅ **Authentication** - JWT-based with role-based access

Legend: ✅ Complete | 🚧 In Progress

## 🎓 Academic Use

This project demonstrates:

- Full-stack web development (MERN)
- RESTful API design
- Database schema design (10 collections)
- Professional UI/UX implementation
- Data Structures & Algorithms in real applications
- Production deployment practices

## 📞 Support

For issues, check:

1. MongoDB Atlas dashboard connectivity
2. Server logs in terminal
3. Browser console (F12) for frontend errors
4. [SETUP.md](SETUP.md) troubleshooting section

## 🙏 Acknowledgments

- Designed with pharmacy workflow best practices
- Color scheme: Professional pharmacy green and amber
- No blue, teal, indigo, purple, gradients, or flashy animations
- Hospital-grade, auditable, deployment-ready

---

**Built with ❤️ for modern pharmacy management**
