# Pharmacy Management System - Complete Flow Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Data Structures & Algorithms Used](#data-structures--algorithms-used)
3. [Complete User Flow](#complete-user-flow)
4. [Technical Implementation](#technical-implementation)
5. [How to Demonstrate to Teacher](#how-to-demonstrate-to-teacher)

---

## System Overview

**PharmaDSA** is a Priority-Driven Pharmacy Management System that demonstrates practical applications of Data Structures & Algorithms (DSA) in a real-world healthcare scenario. The system manages medicine inventory, prescriptions, patient queues, and dispensing operations while ensuring audit trail integrity.

### Key Features

- **Inventory Management** using Hash Table (O(1) lookups)
- **Priority Queue System** using Min-Heap (O(log n) operations)
- **Batch Allocation** using Greedy FEFO Algorithm
- **Audit Logging** using Append-Only Log with Hash Chain (blockchain-like)

---

## Data Structures & Algorithms Used

### 1. Hash Table (Inventory Management)

**Time Complexity**: O(1) for insert, search, delete

**Purpose**: Fast medicine lookup by medicine code

**How it Works**:

- Each medicine has a unique code (e.g., MED001)
- Hash function converts code to array index
- Direct access to medicine information

**Real-World Application**:

- Pharmacist searches for "MED001" → Instant result
- No need to scan through all medicines linearly

---

### 2. Min-Heap Priority Queue (Patient Queue)

**Time Complexity**: O(log n) for insert and extract-min

**Purpose**: Process patients by medical priority, not arrival time

**Priority Levels**:

- Emergency: 0 (highest priority)
- High: 1
- Normal: 2
- Low: 3

**How it Works**:

1. Patient arrives → Added to heap based on priority
2. Heap automatically reorganizes (bubbles up/down)
3. Root always contains highest priority patient
4. When processed, root is removed and heap rebalances

**Real-World Application**:

- Emergency patient added → Automatically goes to front
- Normal patient added → Placed according to priority
- Process Next → Always serves highest priority first

---

### 3. Greedy FEFO Algorithm (Batch Allocation)

**Algorithm Type**: Greedy (locally optimal choices)

**Purpose**: Minimize medicine wastage by using batches closest to expiry first

**How it Works**:

1. Sort all batches by expiry date (earliest first)
2. For each required quantity:
   - Pick batch with earliest expiry
   - Allocate as much as possible from that batch
   - Move to next batch if needed
3. Continue until requirement fulfilled

**Example**:

```
Need: 100 tablets of Paracetamol

Batches:
- Batch A: 50 tablets, expires 2026-02-15
- Batch B: 80 tablets, expires 2026-05-20
- Batch C: 60 tablets, expires 2026-08-10

Allocation:
Step 1: Take 50 from Batch A (earliest) → 50 tablets dispensed
Step 2: Take 50 from Batch B (next earliest) → 100 tablets total

Result: Batch A emptied (would expire soonest), wastage minimized
```

---

### 4. Append-Only Log (Audit Trail)

**Data Structure**: Immutable linked list with cryptographic hash chain

**Purpose**: Tamper-evident audit trail (like blockchain)

**How it Works**:

1. Each log entry contains:

   - Action data (who, what, when)
   - Previous entry's hash
   - Own hash (calculated from data + previous hash)

2. Hash Chain:

```
Entry 0: [Data] → Hash: abc123
Entry 1: [Data] + PrevHash: abc123 → Hash: def456
Entry 2: [Data] + PrevHash: def456 → Hash: ghi789
```

3. Tampering Detection:
   - Change Entry 1's data
   - Entry 1's hash changes
   - Entry 2's previousHash doesn't match
   - Chain breaks → Tampering detected!

---

## Complete User Flow

### Flow 1: Managing Inventory (Hash Table Demo)

#### Step 1: Add New Medicine

1. Navigate to **Inventory** page
2. Click "Add Medicine" button
3. Fill in details:
   - Medicine Name: Paracetamol 500mg
   - Medicine Code: MED001
   - Category: Analgesic
   - Manufacturer: PharmaCo
   - Unit: Tablet
   - Min Stock: 100
   - Max Stock: 500
4. Click "Add Medicine"

**Behind the Scenes**:

- Hash function processes "MED001"
- Medicine stored in hash table at computed index
- O(1) insertion time

#### Step 2: Search Medicine (Hash Table Lookup)

1. In search box, type "MED001"
2. **Instant result** appears
3. Click "View Algorithm" to see hash table visualization

**Behind the Scenes**:

- Hash function computes index from "MED001"
- Direct array access at that index
- O(1) search time (not O(n) linear search!)

#### Step 3: View Batches (FEFO Sorting)

1. Click "View Batches" on any medicine
2. See batches sorted by expiry date (earliest first)
3. This is FEFO ordering for later dispensing

---

### Flow 2: Managing Patient Queue (Min-Heap Demo)

#### Step 1: Add Patients to Queue

1. Navigate to **Queue** page
2. Click "Add Patient" multiple times
3. System adds random patients with different priorities:
   - Patient A: Normal priority
   - Patient B: Emergency priority
   - Patient C: High priority

**Behind the Scenes**:

- Each patient inserted into min-heap
- Heap rebalances (bubbles up) after each insertion
- Emergency patient automatically moves to root

#### Step 2: View Heap Structure

1. Click "View Algorithm" button
2. See visual tree representation of Min-Heap:

```
          Emergency (0)
         /              \
    High (1)         Normal (2)
```

#### Step 3: Process Patient

1. Click "Process Next"
2. Emergency patient is served first (even if added last)
3. Heap rebalances (bubbles down)
4. Next highest priority moves to root

**Key Point**: Priority trumps arrival time (unlike regular FIFO queue)

---

### Flow 3: Dispensing Medicine (Greedy FEFO Demo)

#### Step 1: Search Prescription

1. Navigate to **Dispense** page
2. Enter prescription ID (e.g., RX001)
3. View prescription items

#### Step 2: Dispense with FEFO

1. Click "Dispense All"
2. System shows step-by-step allocation:

   - "Allocating 50 tablets from Batch B001 (expires 2026-02-15)"
   - "Allocating 30 tablets from Batch B002 (expires 2026-03-20)"
   - "Total: 80 tablets dispensed"

3. Click "View Algorithm" to see greedy decision tree

**Behind the Scenes**:

- Batches sorted by expiry date
- Greedy algorithm picks earliest expiring batch first
- Continues until prescription fulfilled

#### Step 3: Confirm Dispensing

1. Review allocation summary
2. Click "Confirm Dispense"
3. Stock updated, audit log created

---

### Flow 4: Audit Trail (Hash Chain Demo)

#### Step 1: View Audit History

1. Navigate to **History** page
2. See all system activities with timestamps
3. Each entry shows hash values

#### Step 2: Add Sample Log (Demo)

1. Click "Add Sample Log" button
2. Random demo log added (e.g., "Create Medicine MED-123")
3. Watch new entry appear at top with:
   - Fresh hash
   - Previous entry's hash linked

**Note**: The "Add Sample Log" button creates **random demonstration logs** for testing purposes. In production:

- Real actions (add medicine, dispense, etc.) automatically create logs
- Random logs won't be generated

#### Step 3: Verify Chain Integrity

1. Click "Verify Chain" button
2. System checks each entry's hash against next entry's previousHash
3. Shows "✓ Chain Intact" or "✗ Tampering Detected"

#### Step 4: View Hash Chain Visualization

1. Click "View Algorithm"
2. See visual hash chain:

```
Entry 3 (Hash: abc123) ← Entry 2 (PrevHash: abc123, Hash: def456) ← Entry 1
```

---

## Technical Implementation

### Frontend Architecture

```
client/
├── src/
│   ├── pages/          # Main application pages
│   │   ├── Inventory.jsx   # Hash Table implementation
│   │   ├── Queue.jsx       # Min-Heap Priority Queue
│   │   ├── Dispense.jsx    # Greedy FEFO Algorithm
│   │   └── History.jsx     # Append-Only Log
│   ├── components/     # Reusable UI components
│   ├── services/       # API communication
│   └── store/          # State management
```

### Backend Architecture

```
server/
├── src/
│   ├── dsa/           # DSA implementations
│   │   ├── HashTable.js
│   │   ├── PriorityQueue.js
│   │   ├── GreedyAllocator.js
│   │   └── LinkedList.js
│   ├── controllers/   # Request handlers
│   ├── models/        # Database schemas
│   └── services/      # Business logic
```

### Key DSA Files

#### 1. HashTable.js

```javascript
class HashTable {
  constructor(size = 50) {
    this.size = size;
    this.table = new Array(size);
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * (i + 1)) % this.size;
    }
    return hash;
  }

  insert(key, value) {
    /* O(1) */
  }
  get(key) {
    /* O(1) */
  }
  delete(key) {
    /* O(1) */
  }
}
```

#### 2. PriorityQueue.js (Min-Heap)

```javascript
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  insert(element, priority) {
    this.heap.push({ element, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    // Remove and return root (highest priority)
    // Rebalance heap
  }

  bubbleUp(index) {
    /* O(log n) */
  }
  bubbleDown(index) {
    /* O(log n) */
  }
}
```

---

## How to Demonstrate to Teacher

### Preparation (5 minutes)

1. Open both client and server terminals
2. Run `npm start` in both
3. Login to system (username: admin, password: admin123)
4. Have this documentation open for reference

### Demo Script (15-20 minutes)

#### Part 1: Hash Table Demo (5 minutes)

**Say**: "First, I'll demonstrate Hash Table for O(1) medicine lookups."

1. Navigate to **Inventory** page
2. Click "View Algorithm" → Explain hash table structure
3. Add new medicine:
   - Show form
   - "When I enter MED001, a hash function calculates the index"
   - Click Add
4. Search for medicine:
   - Type "MED001" in search
   - "Notice instant result - this is O(1) lookup"
   - "Compare this to O(n) linear search through all medicines"
5. Show visualization:
   - "Here you can see how MED001 maps to index 23"
   - "Collisions handled with chaining"

**Key Points to Mention**:

- Hash function: `hash = (char codes × position) % table size`
- O(1) average case for insert/search/delete
- Real pharmacies need fast lookups for thousands of medicines

---

#### Part 2: Min-Heap Priority Queue (5 minutes)

**Say**: "Next, the Priority Queue using Min-Heap to manage patients by urgency."

1. Navigate to **Queue** page
2. Click "View Algorithm" first → Show empty heap
3. Add patients:
   - Click "Add Patient" 3 times
   - "Notice patients have different priorities: Emergency, Normal, High"
4. Show heap visualization:
   - "Emergency patient is at root, even though added last"
   - "This is the heap property: parent ≤ children"
5. Process patient:
   - Click "Process Next"
   - "Emergency patient served first"
   - Watch heap rebalance
6. Explain tree structure:
   - "For node i: left child = 2i+1, right child = 2i+2"
   - "Insertion and extraction are O(log n)"

**Key Points to Mention**:

- FIFO queue would serve by arrival time (wrong for emergencies!)
- Min-Heap ensures highest priority always at root
- O(log n) operations vs O(n) for sorting every time

---

#### Part 3: Greedy FEFO Algorithm (4 minutes)

**Say**: "Now the Greedy Algorithm for First-Expiry-First-Out batch allocation."

1. Navigate to **Dispense** page
2. Search prescription "RX001"
3. Click "Dispense All"
4. Show step-by-step allocation:
   - "System picks batch expiring Feb 15 first"
   - "Then batch expiring Mar 20"
   - "This minimizes wastage"
5. Click "View Algorithm":
   - Show greedy decision tree
   - Explain: "At each step, locally optimal choice (earliest expiry)"

**Key Points to Mention**:

- Greedy property: local choice leads to global optimum
- FEFO vs FIFO: Expiry date matters, not arrival date
- Reduces expired medicine wastage (saves money)

---

#### Part 4: Append-Only Log & Hash Chain (4 minutes)

**Say**: "Finally, the Append-Only Log with hash chain for tamper-evident auditing."

1. Navigate to **History** page
2. Show existing logs
3. Click "Add Sample Log":
   - "New entry appears with fresh hash"
   - Point out previousHash field
4. Click "View Algorithm":
   - Show hash chain visualization
   - "Like blockchain - each entry links to previous"
5. Explain tampering detection:
   - "If someone changes entry 2..."
   - "Entry 2's hash changes"
   - "Entry 3's previousHash won't match"
   - "Chain breaks → tampering detected"
6. Click "Verify Chain" → Show "✓ Chain Intact"

**Key Points to Mention**:

- Immutable: Can only append, never modify/delete
- Cryptographic hash makes tampering evident
- Similar to blockchain technology
- Critical for healthcare regulatory compliance

---

### Q&A Preparation

#### Expected Questions:

**Q1**: "Why use Hash Table instead of Array?"
**A**: "Array requires O(n) linear search. Hash Table gives O(1) with proper hash function. For 1000+ medicines, this is 1000x faster on average."

**Q2**: "What if two medicines hash to same index?"
**A**: "Hash collision! We handle it with chaining - each slot has a linked list. Still O(1) average if load factor kept low."

**Q3**: "Why not just sort the queue?"
**A**: "Sorting is O(n log n) every time. Min-Heap maintains order with O(log n) insertions. For dynamic queue with frequent additions/removals, heap is much better."

**Q4**: "How is FEFO different from FIFO?"
**A**: "FIFO = First-In-First-Out (by arrival time). FEFO = First-Expiry-First-Out (by expiry date). FEFO is greedy algorithm optimizing for least wastage."

**Q5**: "Is the hash chain really secure?"
**A**: "For demonstration, yes. Production systems use SHA-256 or stronger cryptographic hashes. Concept is same - any change breaks the chain."

---

### Common Mistakes to Avoid

1. **Don't say "random logs"**:

   - Say: "Demo logs for testing" or "In production, real actions create logs"

2. **Don't just click buttons**:

   - Explain WHAT happens and WHY before clicking

3. **Don't skip time complexity**:

   - Always mention: "This is O(1)" or "This is O(log n)"
   - Compare to naive approach: "Linear search would be O(n)"

4. **Don't forget real-world context**:
   - "Pharmacies need this because..."
   - "In emergency situations..."
   - "Regulatory requirements for audit trails..."

---

## Summary Points for Teacher

### Why This Project Demonstrates DSA Understanding:

1. **Practical Application**:

   - Not just theory - real pharmacy problems solved
   - Each algorithm chosen for specific reason

2. **Multiple DSA Concepts**:

   - Hash Table (Array-based, hashing, collision handling)
   - Min-Heap (Tree structure, heap property, balancing)
   - Greedy Algorithm (Optimal substructure, greedy choice)
   - Append-Only Log (Linked structure, cryptographic security)

3. **Time Complexity Analysis**:

   - Can explain Big-O for each operation
   - Understands trade-offs (space vs time)

4. **Real-World Problem Solving**:
   - Priority management (emergencies first)
   - Wastage reduction (FEFO)
   - Data integrity (audit logs)
   - Performance optimization (fast lookups)

---

## Testing Checklist Before Presentation

- [ ] Server running without errors
- [ ] Client running without errors
- [ ] Can login successfully
- [ ] Inventory page loads with sample medicines
- [ ] Can add new medicine and search immediately
- [ ] Queue page shows heap visualization
- [ ] Can add patients and process them
- [ ] Dispense page shows prescription search
- [ ] FEFO allocation works step-by-step
- [ ] History page shows audit logs
- [ ] Can add sample log and verify chain
- [ ] All "View Algorithm" modals open correctly

---

## Final Tips

1. **Practice the demo 2-3 times** before presenting
2. **Start with overview** - "This system demonstrates 4 key DSA concepts..."
3. **Show > Tell** - Demonstrate first, explain after
4. **Connect to theory** - "Remember in class we learned about heaps..."
5. **Be confident** - You built this, you understand it!

Good luck with your presentation! 🚀

---

## Quick Reference: Time Complexities

| Operation        | Data Structure | Time Complexity | Why?                      |
| ---------------- | -------------- | --------------- | ------------------------- |
| Medicine Search  | Hash Table     | O(1)            | Direct index access       |
| Add Medicine     | Hash Table     | O(1)            | Hash + insert             |
| Add to Queue     | Min-Heap       | O(log n)        | Bubble up                 |
| Process Patient  | Min-Heap       | O(log n)        | Extract min + bubble down |
| Batch Allocation | Greedy FEFO    | O(n log n)      | Sort batches once         |
| Add Audit Log    | Append-Only    | O(1)            | Append to list            |
| Verify Chain     | Hash Chain     | O(n)            | Check all links           |
