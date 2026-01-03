# User Guide - PharmaDSA 📖

## Table of Contents

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Inventory Management](#inventory-management)
5. [Patient Queue](#patient-queue)
6. [Prescription Dispensing](#prescription-dispensing)
7. [Audit History](#audit-history)
8. [DSA Visualizations](#dsa-visualizations)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Setup

1. **Start the application** (both server and client must be running)
2. **Navigate** to http://localhost:5173
3. **Login** with one of the provided credentials
4. **Explore** each module to see DSA in action

### Navigation

- **Sidebar** - Access all modules
- **Topbar** - User info, logout, help modal
- **Help Button (?)** - In-app guidance anytime

## Login & Authentication

### Available Roles

#### 1. Admin Access

```
Username: admin
Password: admin123
```

**Permissions:**

- ✅ Full system access
- ✅ Manage medicine inventory
- ✅ Process patient queue
- ✅ Dispense prescriptions
- ✅ View audit logs
- ✅ Modify all data

**Use When:** You need complete control for system administration

#### 2. Pharmacist Access

```
Username: pharmacist
Password: pharma123
```

**Permissions:**

- ✅ View inventory
- ✅ Process patient queue
- ✅ Dispense prescriptions
- ✅ View audit logs
- ❌ Cannot modify medicine master data

**Use When:** Daily operational tasks (most common role)

#### 3. Viewer Access

```
Username: viewer
Password: view123
```

**Permissions:**

- ✅ View all pages
- ✅ See data and reports
- ❌ Cannot modify anything
- ❌ Read-only access

**Use When:** Auditing, learning, or demonstration purposes

### Login Process

1. Enter username and password
2. Click "Login"
3. System redirects to Dashboard
4. Your role badge appears in the topbar

## Dashboard Overview

The dashboard provides:

- **Quick Stats** - Total medicines, patients in queue, pending prescriptions
- **Recent Activity** - Latest audit log entries
- **Low Stock Alerts** - Medicines below threshold
- **Priority Patients** - Emergency/High priority patients waiting

### Key Metrics

- **Inventory Status** - Total items, low stock count
- **Queue Status** - Waiting patients, average wait time
- **Dispensing Stats** - Prescriptions processed today
- **System Health** - Hash chain verification status

## Inventory Management

### Using the Hash Table

#### Search for Medicines

1. **Type medicine code** in search bar (e.g., "MED001")
2. **Instant O(1) lookup** displays results
3. **View details**: Name, category, stock, expiry

#### Sample Medicines

```
MED001 - Paracetamol 500mg (150 tablets)
MED002 - Amoxicillin 250mg (75 capsules)
MED003 - Aspirin 100mg (200 tablets)
MED004 - Ibuprofen 400mg (50 tablets) ⚠️ Low Stock
MED005 - Cetirizine 10mg (300 tablets)
MED006 - Omeprazole 20mg (25 capsules) ⚠️ Low Stock
MED007 - Metformin 500mg (180 tablets)
MED008 - Atorvastatin 10mg (100 tablets)
```

#### View Algorithm

1. Click **"View Algorithm"** button
2. See **Hash Table visualization** with 16 buckets
3. Watch **live hashing** of your search query
4. Learn **collision handling** methods
5. Read **C++ implementation** code

#### Low Stock Alerts

- Medicines with stock < 50 show ⚠️ warning
- Displayed in red/orange badges
- Automatic alerts on dashboard

## Patient Queue

### Using the Min-Heap Priority Queue

#### Priority Levels

| Priority     | Value | Use Case         | Processing Order |
| ------------ | ----- | ---------------- | ---------------- |
| 🚨 Emergency | 1     | Life-threatening | First            |
| ⚠️ High      | 2     | Urgent care      | Second           |
| 📋 Normal    | 3     | Standard care    | Third            |
| ✅ Low       | 4     | Non-urgent       | Last             |

#### Sample Patients

```
1. Alice Johnson - Emergency (Priority 1)
2. Bob Smith - High (Priority 2)
3. Carol White - Normal (Priority 3)
4. David Brown - Low (Priority 4)
```

#### Add Patient to Queue

1. Click **"Add Patient"** button
2. Enter patient name
3. Select priority level
4. Click "Add"
5. **Min-heap automatically reorganizes** to maintain priority order

#### Process Next Patient

1. Click **"Process Next"** button
2. **Highest priority patient** (root of min-heap) is processed
3. Heap **automatically rebalances** using heapifyDown
4. Next highest priority moves to root

#### View Algorithm

1. Click **"View Algorithm"** button
2. See **binary tree visualization** of the min-heap
3. Watch **heapifyUp** when adding patients
4. Watch **heapifyDown** (also called extractMin) when processing
5. See **step-by-step operation log**
6. Compare **time complexities** with other data structures

## Prescription Dispensing

### Using the Greedy FEFO Algorithm

#### What is FEFO?

**First-Expiry-First-Out** - Always dispense medicines that expire soonest to minimize wastage.

#### Dispense Prescription

1. **Enter prescription ID**: `PRX-2026-001` (sample)
2. Click **"Search"**
3. System shows:
   - List of prescribed medicines
   - Available batches sorted by expiry
   - **Greedy allocation** from earliest expiry first
   - Total allocated vs required

#### Sample Prescription (PRX-2026-001)

```
Patient: John Doe
Doctor: Dr. Sarah Wilson

Items:
1. Paracetamol 500mg - 30 tablets
   └─ Allocated from: B2024-001 (expires 2025-03-15)

2. Amoxicillin 250mg - 20 capsules
   └─ Allocated from: B2024-012 (expires 2025-05-10)

3. Aspirin 100mg - 15 tablets
   └─ Allocated from: B2024-034 (expires 2025-02-28)
```

#### Understanding Allocation

- **Green badges** = Fully allocated
- **Yellow badges** = Partially allocated (insufficient stock)
- **Red badges** = Not available

#### View Algorithm

1. Click **"View Algorithm"** button
2. See **batch sorting** by expiry date
3. Watch **greedy selection** step-by-step
4. Understand **why FEFO > FIFO/LIFO**
5. See **time complexity breakdown**

#### Complete Dispensing

1. Review allocation
2. Click **"Complete Dispensing"**
3. Stock automatically updated
4. Audit log entry created

## Audit History

### Using the Append-Only Log with Hash Chain

#### Understanding the Log

- **Every action** is permanently recorded
- **Cannot be modified** or deleted (immutable)
- **Hash chain** links all entries (like blockchain)
- **Tampering** is immediately detectable

#### Sample Audit Entries

```
1. 🔐 Login - USR-002 (John Pharmacist)
2. ✏️ Update - MED-003 (Updated Aspirin stock)
3. ➕ Create - PRX-2026-001 (New prescription for John Doe)
4. 📋 Add to Queue - Q-001 (Added PRX-2026-001)
5. 💊 Dispense - PRX-2026-001 (Dispensed prescription)
6. ✏️ Update - MED-001 (Updated Paracetamol stock)
```

#### View Logs

- **Filter by action**: Create, Update, Delete, Dispense, Login
- **Search**: By entity ID, user, or details
- **Chain status**: ✓ Verified (no tampering)

#### Add Log Entry (Demo)

1. Click **"Add Log Entry"** button
2. Random audit action is created
3. New entry **links to previous** via hash
4. Hash chain **automatically verified**

#### View Algorithm

1. Click **"View Algorithm"** button
2. See **hash chain visualization**
3. Understand **entry structure** (timestamp, data, previousHash, hash)
4. See **chain verification** process
5. Learn **real-world applications** (blockchain, financial systems)

## DSA Visualizations

### How to Use Algorithm Modals

Every page has a **"View Algorithm"** button that opens a comprehensive modal with:

#### 1. Algorithm Explanation

- How it works
- Why it's used
- Key concepts

#### 2. Live Visualization

- See your actual data
- Watch operations in real-time
- Interactive demonstrations

#### 3. Code Implementation

- **C++ code snippets**
- Line-by-line explanation
- Best practices

#### 4. Time Complexity

- Big O analysis
- Space complexity
- Performance comparisons

#### 5. Real-World Examples

- Where it's used
- Industry applications
- Similar implementations

#### 6. Try It Out

- Interactive demos
- Sample operations
- Learning exercises

### Tips for Learning

1. **Start with Inventory** (simplest - Hash Table)
2. **Move to Queue** (moderate - Min-Heap)
3. **Try Dispense** (complex - Greedy Algorithm)
4. **Explore History** (advanced - Hash Chain)

## Troubleshooting

### Common Issues

#### Cannot Login

- **Check credentials** - Username and password are case-sensitive
- **Server running?** - Backend must be active on port 5000
- **Database connected?** - Check MongoDB connection

#### Buttons Not Working

- **Check role permissions** - Viewer role is read-only
- **Refresh page** - Sometimes state needs refresh
- **Check console** - Look for errors (F12 → Console)

#### Data Not Loading

- **Wait for loading** - Data has simulated 800ms delay
- **Check network** - API calls should show in Network tab
- **Sample data only** - Currently using hardcoded demo data

#### Modal Not Opening

- **Click "View Algorithm"** - Not "Show DSA"
- **Check for errors** - Console should show issues
- **Browser compatibility** - Use Chrome/Firefox/Edge

### Getting Help

1. **Help Modal** - Click ❓ in topbar for quick reference
2. **Console Logs** - F12 → Console for error messages
3. **Documentation** - Read all docs in `/docs` folder
4. **Code Comments** - Every algorithm has inline explanations

## Keyboard Shortcuts

| Shortcut    | Action                  |
| ----------- | ----------------------- |
| `Ctrl + K`  | Open search (future)    |
| `Esc`       | Close modal             |
| `?`         | Help modal              |
| `Alt + 1-4` | Navigate pages (future) |

## Best Practices

### For Learning

1. Read algorithm explanation first
2. Try operations manually
3. Watch visualizations
4. Study C++ code
5. Compare with other approaches

### For Testing

1. Start with Admin login
2. Try all CRUD operations
3. Test with different priorities
4. Check audit logs
5. Verify data integrity

### For Demonstration

1. Login as Viewer (read-only is safe)
2. Open algorithm modals
3. Show visual izations
4. Explain time complexities
5. Compare with alternatives

---

**Happy Learning! 🎓**

For more details, check other documentation files in the `/docs` folder.
