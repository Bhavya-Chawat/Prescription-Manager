# Pharmacy Management System

A production-ready full-stack pharmacy system demonstrating core data structures and algorithms with real-world applications.

**Status**: Production Ready | **License**: MIT | **Node**: 18+ | **Database**: MongoDB

---

## 🎯 Core Features

| Feature             | Algorithm                    | Time Complexity |
| ------------------- | ---------------------------- | --------------- |
| Queue Management    | Min-Heap (Priority Queue)    | O(log n)        |
| Dispense Allocation | Greedy FEFO                  | O(n log n)      |
| Inventory Lookup    | Hash Table                   | O(1)            |
| Audit Trail         | Append-Only Log + Hash Chain | O(1) append     |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Backend setup
cd server
npm install
npm run seed

# Frontend setup
cd ../client
npm install

# Start
npm start          # Backend: http://localhost:5000
npm run dev        # Frontend: http://localhost:5173
```

### Login Credentials

| Role       | Username   | Password  |
| ---------- | ---------- | --------- |
| Admin      | admin      | admin123  |
| Pharmacist | pharmacist | pharma123 |
| Viewer     | viewer     | view123   |

---

## 📚 Documentation

See the [docs/](docs/) folder:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design & DSA implementations
- **[DATABASE.md](docs/DATABASE.md)** - MongoDB schema reference
- **[API.md](docs/API.md)** - REST API endpoints

---

## 📦 Project Structure

```
client/
├── src/
│   ├── pages/           # Dashboard, Queue, Dispense, Inventory, History
│   ├── components/      # UI & layout components
│   ├── services/        # API clients
│   └── store/           # Zustand auth state
└── index.html

server/
├── src/
│   ├── models/          # 10 MongoDB schemas
│   ├── controllers/     # API handlers
│   ├── services/        # Business logic
│   ├── routes/          # Endpoints
│   ├── dsa/             # Data structures
│   ├── middleware/      # Auth, validation, logging
│   └── utils/           # Helpers
├── scripts/
│   └── seed.js          # Database seeding
└── server.js

docs/
├── ARCHITECTURE.md
├── DATABASE.md
└── API.md
```

---

## 🏗️ Tech Stack

**Backend**: Node.js, Express, MongoDB, Mongoose  
**Frontend**: React 18, Vite, Tailwind CSS, Zustand  
**DSA**: Min-Heap, Hash Table, Linked List, FEFO Greedy, Hash Chain

---

## 🔬 Key Implementations

### Data Structures

- **Min-Heap** - Priority queue (Emergency → High → Normal → Low)
- **Hash Table** - O(1) medicine lookup
- **Linked List** - Prescription items chaining
- **FIFO Queue** - Fair prescription ordering

### Algorithms

- **Greedy FEFO** - First-Expiry-First-Out batch allocation
- **Min-Heap Operations** - Insert, extract-min, heapify
- **Hash Chain** - Tamper-proof audit trail verification

---

## 📊 Database Models

1. **User** - Authentication & roles
2. **Patient** - Demographics
3. **Medicine** - Catalog & pricing
4. **Batch** - Stock tracking with expiry
5. **Prescription** - Patient orders
6. **QueueEntry** - Priority queue
7. **Dispense** - Fulfillment records
8. **Bill** - Payment tracking
9. **AuditLog** - Immutable history
10. **Supplier** - Medicine sources

---

## ⚙️ Environment Configuration

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/pharmacy
JWT_SECRET=your_secret_key
PORT=5000
```

For MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pharmacy
```

---

## 🧪 Seed Data

```bash
cd server
npm run seed
```

Creates:

- 10 unique patients
- 6 medicines with realistic stock levels
- 10 prescriptions (5 queued, 5 dispensed with bills)
- Sample dispense records

---

## 📖 Core Workflows

### 1. Create Prescription

Patient prescription → Auto-queued by priority → Added to Min-Heap

### 2. Process Queue

Min-Heap sorted → Call next → Dispense

### 3. Dispense Medicine

Search prescription → Greedy FEFO allocation → Auto-bill → Update inventory

### 4. View History

All records logged → Hash chain verified → Tamper detection

---

## ✨ Key Features

✅ **Real-time Dashboard** - Stock alerts, revenue, queue metrics  
✅ **Auto-queue** - Prescriptions automatically prioritized  
✅ **FEFO Allocation** - Minimizes medicine wastage  
✅ **Immutable Audit** - Blockchain-like hash chain  
✅ **Role-based Access** - Admin, Pharmacist, Viewer  
✅ **Responsive UI** - Professional pharmacy interface  
✅ **Production Ready** - Error handling, validation, logging

---

## 🛠️ NPM Scripts

```bash
npm start              # Start backend (dev mode with nodemon)
npm run seed           # Populate database
cd ../client
npm run dev            # Start frontend (Vite)
npm run build          # Production build
```

---

## 📄 License

MIT

---

**Built with** ❤️ for healthcare management
