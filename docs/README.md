# PharmaDSA - Documentation Index 📚

## Welcome to PharmaDSA Documentation

This folder contains all comprehensive documentation for the PharmaDSA pharmacy management system.

## 📖 Documentation Files

### Getting Started

- **[../README.md](../README.md)** - Main project overview and quick start guide
- **[SETUP.md](./SETUP.md)** - Complete installation and environment setup
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Production deployment guide
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Pre-deployment verification checklist

### User Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete feature walkthrough and usage instructions
- **[SYSTEM_FLOW_DOCUMENTATION.md](./SYSTEM_FLOW_DOCUMENTATION.md)** - System flow and architecture explanation

### Technical Documentation

- **[DSA_ALGORITHMS.md](./DSA_ALGORITHMS.md)** - Algorithm implementations with C++ code and theory
- **[SAMPLE_DATA.md](./SAMPLE_DATA.md)** - Sample data structures and sources
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project summary and features

## � System Features

- **Role-Based Access Control** - 3 user roles with different permissions
- **Cloud Database** - MongoDB Atlas integration
- **Audit Trail** - Immutable hash chain for compliance
- **DSA Implementations** - Hash Table, Min-Heap, Greedy FEFO, Append-Only Log
- **Production Ready** - Fully tested and deployable

## 🔑 Test Credentials

For testing purposes, the system comes with pre-seeded users:

| Role           | Username     | Password    | Access Level       |
| -------------- | ------------ | ----------- | ------------------ |
| **Admin**      | `admin`      | `admin123`  | Full system access |
| **Pharmacist** | `pharmacist` | `pharma123` | Operational access |
| **Viewer**     | `viewer`     | `view123`   | Read-only access   |

**⚠️ IMPORTANT**: Change these passwords immediately in production!

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions or [../README.md](../README.md) for quick start guide.

## 📂 Project Structure

```
Prescription Manager/
├── client/              # React frontend
│   └── src/
│       ├── components/  # UI components
│       ├── pages/       # Application pages
│       └── services/    # API services
├── server/              # Node.js backend
│   └── src/
│       ├── models/      # MongoDB schemas
│       ├── controllers/ # Business logic
│       ├── dsa/         # DSA implementations
│       └── middleware/  # Auth & validation
└── docs/                # Documentation (you are here)
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Zustand
- **Backend**: Node.js, Express.js, MongoDB
- **Security**: JWT, bcrypt, RBAC
- **DSA**: Custom implementations in JavaScript

## 📝 License

MIT License - See LICENSE file for details

---

**Last Updated**: January 2026  
**Status**: Production Ready
