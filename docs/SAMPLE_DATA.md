# Sample Data Guide 📊

## Overview

This application uses **simulated sample data** for demonstration purposes. While a MongoDB database exists with seeded data, the current pages use hardcoded sample data generated in each page's fetch functions for easier DSA visualization and demonstration.

## Why Sample Data?

- **Clear DSA Demonstrations**: Hardcoded data makes algorithm operations more predictable and visible
- **No Database Dependency**: Pages work independently without requiring active database connections
- **Educational Purpose**: Easier to understand algorithm behavior with controlled data sets
- **Quick Testing**: Instant page loads without API latency

## Sample Data by Page

### 💊 Inventory Page

**Location**: `client/src/pages/Inventory.jsx` → `fetchMedicines()` function

**Data Structure**:

```javascript
8 medicines (MED001-MED008):
- Paracetamol 500mg (MED001) - 150 tablets
- Amoxicillin 250mg (MED002) - 75 capsules
- Aspirin 100mg (MED003) - 200 tablets
- Ibuprofen 400mg (MED004) - 50 tablets (Low Stock)
- Cetirizine 10mg (MED005) - 300 tablets
- Omeprazole 20mg (MED006) - 25 capsules (Low Stock)
- Metformin 500mg (MED007) - 180 tablets
- Atorvastatin 10mg (MED008) - 100 tablets
```

**DSA**: Hash Table with 16 buckets for O(1) medicine lookup

**Generated**: `setTimeout(..., 800ms)` in `fetchMedicines()`

---

### 👥 Queue Page

**Location**: `client/src/pages/Queue.jsx` → `fetchQueue()` function

**Data Structure**:

```javascript
4 sample patients:
1. Alice Johnson (Emergency) - Priority: 1
2. Bob Smith (High) - Priority: 2
3. Carol White (Normal) - Priority: 3
4. David Brown (Low) - Priority: 4
```

**DSA**: Min-Heap Priority Queue for automatic priority ordering

**Generated**: `setTimeout(..., 800ms)` in `fetchQueue()`

---

### 💊 Dispense Page

**Location**: `client/src/pages/Dispense.jsx` → `sampleBatches` object

**Data Structure**:

```javascript
3 medicines with batch data:

Paracetamol 500mg:
  - B2024-001 (Expiry: 2025-03-15) - 50 units
  - B2024-023 (Expiry: 2025-06-20) - 100 units
  - B2024-045 (Expiry: 2025-12-31) - 150 units

Amoxicillin 250mg:
  - B2024-012 (Expiry: 2025-05-10) - 30 units
  - B2024-067 (Expiry: 2025-08-25) - 80 units

Aspirin 100mg:
  - B2024-034 (Expiry: 2025-02-28) - 10 units
  - B2024-089 (Expiry: 2025-11-15) - 5 units
```

**DSA**: Greedy FEFO (First-Expiry-First-Out) algorithm

**Generated**: `useMemo()` with `sampleBatches` object

**Test Prescription ID**: `PRX-2026-001`

---

### 📜 History Page

**Location**: `client/src/pages/History.jsx` → `AppendOnlyLog` initialization

**Data Structure**:

```javascript
6 pre-loaded audit entries:
1. Login - User (USR-002) - John Pharmacist
2. Update - Medicine (MED-003) - Updated Aspirin stock
3. Create - Prescription (PRX-2026-001) - New prescription for John Doe
4. Add to Queue - Queue (Q-001) - Added prescription with High priority
5. Dispense - Prescription (PRX-2026-001) - Dispensed prescription
6. Update - Medicine (MED-001) - Updated Paracetamol stock
```

**DSA**: Append-Only Log with Hash Chain (Blockchain-style)

**Generated**: Initialized in component state with `AppendOnlyLog` class

---

## How Sample Data Works

### 1. Simulated API Responses

Each page uses `setTimeout()` to simulate API latency:

```javascript
setTimeout(() => {
  // Set sample data
  setMedicines(sampleMedicines);
  setLoading(false);
}, 800); // 800ms delay to simulate network request
```

### 2. Local State Management

- Data is stored in React component state (useState)
- No actual database queries during page load
- Changes (add, update, delete) are local to the session

### 3. DSA Operations

All DSA operations work on the sample data:

- **Inventory**: Hash table insertions and lookups
- **Queue**: Min-heap insertions and extractions
- **Dispense**: FEFO greedy allocation from batches
- **History**: Append-only log with hash chain verification

## Testing the Application

### Login Credentials

```
Admin:
  Username: admin
  Password: admin123

Pharmacist:
  Username: pharmacist
  Password: pharma123

Viewer:
  Username: viewer
  Password: view123
```

### Sample Operations to Try

#### Inventory

1. Search for "MED001" - instant O(1) hash lookup
2. Click "View Algorithm" to see hash table visualization
3. Notice medicines with stock < 50 marked as "Low Stock"

#### Queue

1. Click "Add Patient" to insert into min-heap
2. Click "Process Next" to extract highest priority
3. Watch the heap automatically reorganize
4. Click "View Algorithm" for min-heap tree visualization

#### Dispense

1. Enter prescription ID: `PRX-2026-001`
2. Click "Search" to see FEFO allocation
3. Notice batches sorted by expiry date
4. See greedy allocation from earliest expiry first
5. Click "View Algorithm" for detailed FEFO visualization

#### History

1. Click "Add Log Entry" to append to the chain
2. Watch new entry link to previous hash
3. Chain verification confirms integrity
4. Click "View Algorithm" to see hash chain visualization

## Database vs Sample Data

### Current Setup

- **Frontend Pages**: Use sample data (hardcoded)
- **Database (MongoDB)**: Exists with seeded data
- **Backend API**: Has routes but pages don't call them yet

### Why Not Use Database?

The sample data approach was chosen for:

1. **Educational clarity**: Predictable data for DSA demonstrations
2. **Independent operation**: No backend/database dependency
3. **Quick development**: Focus on frontend and algorithms
4. **Easier debugging**: Controlled data sets

### Future Migration

To connect to the real database:

1. Replace `setTimeout()` with actual `axios.get()` calls
2. Use API routes: `/api/medicines`, `/api/queue`, etc.
3. Update state management to handle real API responses
4. Add error handling and loading states

## File Locations

```
client/src/pages/
├── Inventory.jsx     → fetchMedicines() with 8 medicines
├── Queue.jsx         → fetchQueue() with 4 patients
├── Dispense.jsx      → sampleBatches object with 3 medicines
└── History.jsx       → AppendOnlyLog initialization with 6 entries

server/
├── routes/
│   ├── medicines.js  → Real API routes (not used by frontend yet)
│   ├── queue.js
│   ├── prescriptions.js
│   └── audit.js
└── seed.js           → Database seeding script
```

## Summary

**Sample Data Location**: Each page's fetch function or initialization code

**Purpose**: Enable clear DSA demonstrations without database dependency

**Scope**: Frontend-only, not connected to MongoDB backend

**Benefit**: Predictable behavior for educational and testing purposes

**Access via**: Help Modal in top navigation bar (click the question mark icon)

---

For questions about the data structures and algorithms, click the **"View Algorithm"** button on any page to see detailed visualizations and explanations! 🚀
