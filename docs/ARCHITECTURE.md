# System Architecture & DSA Implementation

## Overview

This pharmacy management system demonstrates practical implementations of core data structures and algorithms in a real-world healthcare context.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│         (Dashboard, Queue, Dispense, Inventory, History)    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────────┐
│                  Express Server                             │
│  (Controllers, Services, Middleware, Error Handling)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              MongoDB Database                               │
│  (10 Models with proper relationships & indexes)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Structures

### 1. Min-Heap (Priority Queue)

**Location**: `server/src/dsa/PriorityQueue.js`

**Purpose**: Queue patients by medical urgency (4 priority levels)

**Priority Levels**:

- Level 0: Emergency (red)
- Level 1: High (orange)
- Level 2: Normal (yellow)
- Level 3: Low (blue)

**Operations**:

- `insert(element, priority)` - O(log n)
- `extractMin()` - O(log n)
- `heapify()` - O(log n)

**Real-world Example**:

```
Queue: [Emergency (heart attack), High (fever), Normal (checkup)]
When new Emergency added → Re-heapified to top
Process always takes Emergency first
```

---

### 2. Hash Table

**Location**: `server/src/dsa/HashTable.js`

**Purpose**: O(1) medicine lookup in inventory system

**Implementation**:

- Hash function: Medicine ID/code → index
- Collision handling: Chaining
- Load factor: 0.75 (resize at 75% capacity)

**Operations**:

- `set(key, value)` - O(1) average
- `get(key)` - O(1) average
- `delete(key)` - O(1) average

**Real-world Example**:

```
Search "MED001" → Direct lookup → Medicine details in 1 step
MongoDB Index: { medicineCode: 1 } for O(1) retrieval
```

---

### 3. Linked List

**Location**: `server/src/models/Prescription.model.js`

**Purpose**: Chain prescription items with O(1) append

**Structure**:

```javascript
items: [
  {
    _id: ObjectId, // Each item has unique ID
    medicineId: ref, // Link to medicine
    quantity: 10,
    dosage: "500mg",
  },
];
```

**Operations**:

- `append(item)` - O(1)
- `traverse()` - O(n)
- `search(medicineId)` - O(n)

---

### 4. FIFO Queue

**Location**: `server/src/dsa/FIFOQueue.js`

**Purpose**: Fair prescription processing order

**Operations**:

- `enqueue(item)` - O(1)
- `dequeue()` - O(1)

**Real-world**: First prescription created = first processed

---

### 5. Append-Only Log + Hash Chain

**Location**: `server/src/models/AuditLog.model.js`

**Purpose**: Immutable, tamper-proof audit trail

**Hash Chain Structure**:

```javascript
{
  action: "DISPENSE",
  previousHash: "abc123...",  // Links to previous record
  currentHash: "def456...",   // This record's hash
  timestamp: Date,
  userId: ref,
  details: {...}
}
```

**Properties**:

- Append-only: Never delete, only append new records
- Hash chain: Each record includes previous hash
- Verification: Detect tampering by recomputing hash chain
- O(1) append, O(n) verification

---

## 🎯 Algorithms

### Greedy FEFO (First-Expiry-First-Out)

**Location**: `server/src/dsa/GreedyAllocator.js`

**Purpose**: Allocate medicine batches to minimize wastage

**Algorithm**:

```
For each medicine item in prescription:
  1. Get all available batches of that medicine
  2. Sort by expiry date (earliest first)
  3. Greedily pick from earliest-expiring batches
  4. Mark as dispensed when quantity satisfied
  5. Handle backorders if insufficient stock
```

**Time Complexity**: O(n log n) where n = batches

**Real-world Example**:

```
Medicine: Crocin 500mg, Qty: 10
Batches:
  - Batch1: 5 units, expires Jan 10 (pick first)
  - Batch2: 8 units, expires Feb 15
Result: 5 from Batch1 + 5 from Batch2 = 10 units
Minimizes waste of Batch1 nearing expiry
```

---

## 🔄 Data Flow Workflows

### Workflow 1: Create & Auto-Queue Prescription

```
1. User creates prescription (patient + medicines)
2. Prescription saved with status="draft"
3. System assigns priority based on urgency
4. Creates QueueEntry with priority
5. Min-Heap rebalances → Prescription in queue
```

### Workflow 2: Process Queue

```
1. Queue page displays Min-Heap ordered patients
2. "Process Next" extracts min from heap
3. Patient called, redirects to Dispense
4. QueueEntry status updated to "called"
```

### Workflow 3: Dispense with FEFO

```
1. Dispense page loads prescription
2. For each medicine:
   - Greedy algorithm picks earliest-expiring batch
   - Decrements batch quantity
   - Tracks allocation in dispense record
3. Bill auto-created
4. Prescription status → "dispensed"
5. QueueEntry status → "completed"
6. Audit log records action with hash chain
```

### Workflow 4: Audit Trail Verification

```
1. View History page displays all dispense records
2. Hash chain displayed: Record1 → Record2 → Record3
3. To verify:
   - Recalculate each record's hash
   - Verify each hash matches previous record's hash
   - Any tampering detected immediately
```

---

## 📈 Complexity Analysis

| Operation                      | Data Structure | Complexity |
| ------------------------------ | -------------- | ---------- |
| Add prescription to queue      | Min-Heap       | O(log n)   |
| Get next high-priority patient | Min-Heap       | O(log n)   |
| Lookup medicine by code        | Hash Table     | O(1)       |
| Allocate batches FEFO          | Sorted list    | O(n log n) |
| Add audit log entry            | Append-only    | O(1)       |
| Verify audit trail             | Hash chain     | O(n)       |
| Search prescription items      | Linked list    | O(n)       |

---

## 🔐 Database Relationships

```
User → (1:many) → AuditLog
User → (1:1) → Authentication

Patient → (1:many) → Prescription
Prescription → (1:many) → Item (Linked List)
Item → (many:1) → Medicine

Medicine → (1:many) → Batch
Batch → (many:1) → Supplier

Prescription → (1:1) → QueueEntry
QueueEntry → (many:1) → User (pharmacist)

Prescription → (1:1) → Dispense
Dispense → (1:many) → Allocation
Allocation → (many:1) → Batch

Dispense → (1:1) → Bill
```

---

## 🛠️ Implementation Examples

### Min-Heap Insert

```javascript
insert(element, priority) {
  this.heap.push({element, priority});
  this.heapifyUp(this.heap.length - 1);
}

heapifyUp(index) {
  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (this.heap[index].priority < this.heap[parentIndex].priority) {
      [this.heap[index], this.heap[parentIndex]] =
      [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    } else break;
  }
}
```

### Greedy FEFO Allocation

```javascript
allocateFEFO(medicineBatches, requiredQty) {
  const sorted = batches.sort((a,b) => a.expiryDate - b.expiryDate);
  let allocated = [];
  let remaining = requiredQty;

  for (let batch of sorted) {
    if (remaining <= 0) break;
    const qty = Math.min(batch.quantity, remaining);
    allocated.push({batchId: batch._id, quantity: qty});
    remaining -= qty;
  }

  return {allocated, backorder: remaining > 0};
}
```

### Hash Chain Verification

```javascript
verifyHashChain(records) {
  for (let i = 1; i < records.length; i++) {
    const currentPrevHash = records[i].previousHash;
    const actualPrevHash = sha256(JSON.stringify(records[i-1]));
    if (currentPrevHash !== actualPrevHash) {
      return {valid: false, tamperedAt: i};
    }
  }
  return {valid: true};
}
```

---

## 📱 Frontend Integration

**React Components**:

- `Dashboard.jsx` - Displays aggregated metrics
- `Queue.jsx` - Shows Min-Heap ordered queue
- `Dispense.jsx` - FEFO allocation interface
- `Inventory.jsx` - Hash Table medicine search
- `History.jsx` - Audit trail with hash chain verification

**State Management**: Zustand for auth state

**API Integration**: Axios services calling Express endpoints

---

## 🚀 Performance Optimization

1. **Database Indexes**:

   - `medicineCode` - O(1) lookup
   - `patientId` - Linking queries
   - `expiryDate` - Batch sorting

2. **API Caching**: Frontend caches queue snapshot

3. **Pagination**: History records paginated (20 per page)

4. **Hash Chain**: Verification done server-side

---

## 🧪 Testing Scenarios

1. **Queue Priority**: Create 4 prescriptions with different priorities → Verify heap order

2. **FEFO Allocation**: Create prescriptions with multiple medicines → Verify batches allocated by expiry

3. **Hash Chain Tamper Detection**: Manually modify audit record → Verify chain breaks

4. **Medicine Search**: Search by code → Verify O(1) lookup performance

---

## 📚 References

- **Min-Heap**: Classic priority queue implementation
- **Hash Tables**: Dictionary/map data structure
- **Linked Lists**: Efficient append operations
- **FEFO Greedy**: Minimizes waste in stock management
- **Hash Chain**: Similar to blockchain immutability
- **Append-only Logs**: Industry standard for audit trails

---

**Last Updated**: Jan 2026
