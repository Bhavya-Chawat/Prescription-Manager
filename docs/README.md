# PharmaDSA - Priority-Driven Pharmacy Management System 🏥

## Overview

PharmaDSA is an educational web application demonstrating **Data Structures & Algorithms** in a real-world pharmacy management context. Each module showcases a different DSA with practical applications and visualizations.

## 🎯 Purpose

This project serves as:

- **Educational Tool**: Learn DSA through practical pharmacy scenarios
- **Portfolio Project**: Demonstrate full-stack development skills
- **Algorithm Visualization**: Interactive DSA demonstrations
- **Role-Based System**: RBAC implementation example

## 🏗️ Architecture

```
Prescription Manager/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   ├── store/       # Zustand state management
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets
├── server/          # Node.js + Express backend
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   └── middleware/  # Authentication & validation
└── docs/            # Documentation files
```

## 🔑 Login Credentials

### Role-Based Access Control (RBAC)

| Role           | Username     | Password    | Permissions                                                             |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------- |
| **Admin**      | `admin`      | `admin123`  | Full access: manage medicines, process queue, dispense, view audit logs |
| **Pharmacist** | `pharmacist` | `pharma123` | Operational: dispense medicines, manage queue, view inventory           |
| **Viewer**     | `viewer`     | `view123`   | Read-only: view data only, no modifications                             |

**Purpose**: Demonstrates security hierarchy in healthcare systems where different roles have different access levels.

## 📚 Documentation Files

- **[USER_GUIDE.md](./USER_GUIDE.md)** - How to use the application
- **[DSA_ALGORITHMS.md](./DSA_ALGORITHMS.md)** - Algorithm explanations with C++ code
- **[SAMPLE_DATA.md](./SAMPLE_DATA.md)** - Sample data structure and sources
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Backend API documentation
- **[SETUP.md](../SETUP.md)** - Installation and setup instructions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Prescription Manager"
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Setup environment variables**

```bash
# In server directory
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Seed the database**

```bash
cd server
npm run seed
```

5. **Run the application**

Terminal 1 (Backend):

```bash
cd server
npm run dev
```

Terminal 2 (Frontend):

```bash
cd client
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🎨 Features by Module

### 💊 Inventory Management

- **DSA**: Hash Table (16 buckets)
- **Complexity**: O(1) lookup, O(1) insert
- **Features**: Instant medicine search, stock tracking, low stock alerts

### 👥 Patient Queue

- **DSA**: Min-Heap Priority Queue
- **Complexity**: O(log n) insert/extract, O(1) peek
- **Features**: Priority-based processing, automatic ordering, emergency handling

### 📋 Prescription Dispensing

- **DSA**: Greedy FEFO Algorithm
- **Complexity**: O(n log n) sort + O(n) allocate
- **Features**: Batch expiry management, wastage minimization, allocation optimization

### 📜 Audit History

- **DSA**: Append-Only Log with Hash Chain
- **Complexity**: O(1) append, O(n) verify
- **Features**: Immutable audit trail, tamper detection, blockchain-like verification

## 🔧 Technology Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Radix UI** - Accessible components

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📖 Learning Resources

Each algorithm page includes:

- **Interactive visualization** - See the data structure in action
- **Step-by-step explanation** - Understand how it works
- **Time complexity analysis** - Learn the efficiency
- **Real-world applications** - Where it's used
- **C++ implementation** - Code examples
- **Comparison tables** - Why this algorithm?

## 🤝 Contributing

This is an educational project. Feel free to:

- Report bugs
- Suggest improvements
- Add new DSA demonstrations
- Improve documentation

## 📝 License

MIT License - Free to use for educational purposes

## 👨‍💻 Author

Built as a learning project to demonstrate DSA knowledge in practical applications.

---

**Need Help?** Click the ❓ Help button in the top navigation for in-app guidance!
