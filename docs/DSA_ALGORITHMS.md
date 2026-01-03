# DSA Algorithms with C++ Implementation 💻

## Table of Contents

1. [Hash Table (Inventory)](#1-hash-table-inventory)
2. [Min-Heap Priority Queue (Patient Queue)](#2-min-heap-priority-queue-patient-queue)
3. [Greedy FEFO Algorithm (Dispensing)](#3-greedy-fefo-algorithm-dispensing)
4. [Append-Only Log with Hash Chain (Audit)](#4-append-only-log-with-hash-chain-audit)

---

## 1. Hash Table (Inventory)

### Purpose

**Fast medicine lookup by code** - O(1) average case complexity for search, insert, and delete operations.

### Theory

A hash table uses a **hash function** to compute an index into an array of buckets, from which the desired value can be found. Collisions are handled using **chaining** (linked lists at each bucket).

**Hash Function:**

```
hash(key) = (sum of character codes) % TABLE_SIZE
```

### Use Cases

- Database indexing
- Caching systems
- Symbol tables in compilers
- Dictionary implementations
- DNS lookups

### Time Complexity

| Operation | Average | Worst |
| --------- | ------- | ----- |
| Search    | O(1)    | O(n)  |
| Insert    | O(1)    | O(n)  |
| Delete    | O(1)    | O(n)  |

**Space Complexity**: O(n) where n = number of elements

### C++ Implementation

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <list>
using namespace std;

// Medicine structure
struct Medicine {
    string code;
    string name;
    string category;
    int stock;
    string expiry;

    Medicine(string c, string n, string cat, int s, string e)
        : code(c), name(n), category(cat), stock(s), expiry(e) {}
};

class HashTable {
private:
    static const int TABLE_SIZE = 16;  // Using 16 buckets
    vector<list<Medicine>> table;      // Array of linked lists for chaining

    // Hash function: sum ASCII values mod table size
    int hashFunction(const string& key) {
        int hash = 0;
        for (char c : key) {
            hash += static_cast<int>(c);
        }
        return hash % TABLE_SIZE;
    }

public:
    HashTable() {
        table.resize(TABLE_SIZE);
    }

    // Insert medicine into hash table - O(1) average
    void insert(const Medicine& med) {
        int index = hashFunction(med.code);

        // Check if already exists (update scenario)
        for (auto& m : table[index]) {
            if (m.code == med.code) {
                m = med;  // Update existing
                return;
            }
        }

        // Add new medicine to the bucket
        table[index].push_back(med);
        cout << "Inserted " << med.name << " into bucket " << index << endl;
    }

    // Search for medicine by code - O(1) average
    Medicine* search(const string& code) {
        int index = hashFunction(code);

        // Search in the bucket's linked list
        for (auto& med : table[index]) {
            if (med.code == code) {
                cout << "Found " << med.name << " in bucket " << index << endl;
                return &med;
            }
        }

        cout << "Medicine " << code << " not found" << endl;
        return nullptr;
    }

    // Delete medicine by code - O(1) average
    bool remove(const string& code) {
        int index = hashFunction(code);

        // Find and remove from the linked list
        auto& bucket = table[index];
        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->code == code) {
                cout << "Removed " << it->name << " from bucket " << index << endl;
                bucket.erase(it);
                return true;
            }
        }

        return false;
    }

    // Display hash table structure
    void display() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            cout << "Bucket " << i << ": ";
            if (table[i].empty()) {
                cout << "empty";
            } else {
                for (const auto& med : table[i]) {
                    cout << "[" << med.code << ": " << med.name << "] ";
                }
            }
            cout << endl;
        }
    }

    // Get load factor (for performance monitoring)
    double getLoadFactor() {
        int totalElements = 0;
        for (const auto& bucket : table) {
            totalElements += bucket.size();
        }
        return static_cast<double>(totalElements) / TABLE_SIZE;
    }
};

// Example usage
int main() {
    HashTable inventory;

    // Insert sample medicines
    inventory.insert(Medicine("MED001", "Paracetamol 500mg", "Analgesic", 150, "2025-12-31"));
    inventory.insert(Medicine("MED002", "Amoxicillin 250mg", "Antibiotic", 75, "2025-08-15"));
    inventory.insert(Medicine("MED003", "Aspirin 100mg", "Analgesic", 200, "2026-01-20"));

    cout << "\n=== Hash Table Structure ===" << endl;
    inventory.display();

    cout << "\n=== Search Operations ===" << endl;
    Medicine* found = inventory.search("MED001");
    if (found) {
        cout << "Stock: " << found->stock << " units" << endl;
    }

    cout << "\nLoad Factor: " << inventory.getLoadFactor() << endl;

    return 0;
}
```

### Key Concepts

1. **Hash Function**: Converts key to array index
2. **Collisions**: When two keys hash to same index
3. **Chaining**: Use linked lists to handle collisions
4. **Load Factor**: n/m ratio affects performance (keep < 0.75)

---

## 2. Min-Heap Priority Queue (Patient Queue)

### Purpose

**Maintain patients in priority order** with efficient insertion and extraction of highest priority.

### Theory

A **min-heap** is a complete binary tree where each parent node is smaller than its children. The root always contains the minimum (highest priority) element.

**Heap Property:**

```
For every node i:
  heap[parent(i)] ≤ heap[i]
```

**Array Representation:**

```
Parent(i) = (i-1)/2
Left(i) = 2i + 1
Right(i) = 2i + 2
```

### Use Cases

- Task scheduling (OS process queues)
- Dijkstra's shortest path
- Huffman coding
- Event-driven simulation
- Emergency room triage

### Time Complexity

| Operation   | Time     |
| ----------- | -------- |
| Insert      | O(log n) |
| Extract Min | O(log n) |
| Peek Min    | O(1)     |
| Build Heap  | O(n)     |

**Space Complexity**: O(n)

### C++ Implementation

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Patient structure
struct Patient {
    string name;
    string priority;  // Emergency, High, Normal, Low
    int priorityValue;
    string condition;

    Patient(string n, string p, string c)
        : name(n), priority(p), condition(c) {
        // Map priority to numeric value (lower = higher priority)
        if (p == "Emergency") priorityValue = 1;
        else if (p == "High") priorityValue = 2;
        else if (p == "Normal") priorityValue = 3;
        else priorityValue = 4;  // Low
    }
};

class MinHeap {
private:
    vector<Patient> heap;

    int parent(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return 2 * i + 1; }
    int rightChild(int i) { return 2 * i + 2; }

    // Maintain heap property upward (used after insertion)
    void heapifyUp(int index) {
        while (index > 0 && heap[parent(index)].priorityValue > heap[index].priorityValue) {
            swap(heap[parent(index)], heap[index]);
            index = parent(index);
        }
    }

    // Maintain heap property downward (used after extraction)
    void heapifyDown(int index) {
        int minIndex = index;
        int left = leftChild(index);
        int right = rightChild(index);

        // Find smallest among parent, left, and right
        if (left < heap.size() && heap[left].priorityValue < heap[minIndex].priorityValue) {
            minIndex = left;
        }
        if (right < heap.size() && heap[right].priorityValue < heap[minIndex].priorityValue) {
            minIndex = right;
        }

        // If parent is not smallest, swap and continue
        if (index != minIndex) {
            swap(heap[index], heap[minIndex]);
            heapifyDown(minIndex);
        }
    }

public:
    // Insert patient - O(log n)
    void insert(const Patient& patient) {
        heap.push_back(patient);
        int index = heap.size() - 1;

        cout << "Inserting " << patient.name << " (Priority: " << patient.priority << ")" << endl;
        heapifyUp(index);
        cout << "Heapified up from index " << index << endl;
    }

    // Extract highest priority patient - O(log n)
    Patient extractMin() {
        if (heap.empty()) {
            throw runtime_error("Queue is empty!");
        }

        Patient minPatient = heap[0];
        cout << "Extracting " << minPatient.name << " (Highest Priority)" << endl;

        // Move last element to root and heapify down
        heap[0] = heap.back();
        heap.pop_back();

        if (!heap.empty()) {
            heapifyDown(0);
        }

        return minPatient;
    }

    // Peek at highest priority - O(1)
    Patient peek() const {
        if (heap.empty()) {
            throw runtime_error("Queue is empty!");
        }
        return heap[0];
    }

    bool isEmpty() const {
        return heap.empty();
    }

    int size() const {
        return heap.size();
    }

    // Display heap as array
    void display() const {
        cout << "Current Heap (array representation): [";
        for (size_t i = 0; i < heap.size(); i++) {
            cout << heap[i].name << "(" << heap[i].priorityValue << ")";
            if (i < heap.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }

    // Display heap as tree (simplified)
    void displayTree() const {
        if (heap.empty()) return;

        int level = 0;
        int levelSize = 1;
        int index = 0;

        while (index < heap.size()) {
            cout << "Level " << level << ": ";
            for (int i = 0; i < levelSize && index < heap.size(); i++, index++) {
                cout << heap[index].name << "(" << heap[index].priorityValue << ") ";
            }
            cout << endl;
            level++;
            levelSize *= 2;
        }
    }
};

// Example usage
int main() {
    MinHeap patientQueue;

    // Add patients with different priorities
    patientQueue.insert(Patient("Alice", "Emergency", "Cardiac arrest"));
    patientQueue.insert(Patient("Bob", "High", "Severe pain"));
    patientQueue.insert(Patient("Carol", "Normal", "Routine checkup"));
    patientQueue.insert(Patient("David", "Low", "Cold symptoms"));
    patientQueue.insert(Patient("Eve", "Emergency", "Trauma"));

    cout << "\n=== Heap Structure ===" << endl;
    patientQueue.display();
    patientQueue.displayTree();

    cout << "\n=== Processing Patients ===" << endl;
    while (!patientQueue.isEmpty()) {
        Patient next = patientQueue.extractMin();
        cout << "Processing: " << next.name << " - " << next.condition << endl;
        patientQueue.display();
        cout << endl;
    }

    return 0;
}
```

### Key Concepts

1. **Complete Binary Tree**: All levels filled except possibly last
2. **Heap Property**: Parent ≤ children (min-heap)
3. **HeapifyUp**: Restore property after insertion
4. **HeapifyDown**: Restore property after extraction
5. **Array Representation**: Efficient storage without pointers

---

## 3. Greedy FEFO Algorithm (Dispensing)

### Purpose

**Minimize medicine wastage** by dispensing batches with earliest expiry dates first.

### Theory

A **greedy algorithm** makes locally optimal choices at each step, hoping to find a global optimum. For FEFO, the greedy choice is always selecting the batch that expires soonest.

**Greedy Property:**

```
For medicine wastage minimization:
  Local optimum (earliest expiry) = Global optimum
```

### Use Cases

- Inventory rotation (FIFO/FEFO)
- Job scheduling
- Huffman encoding
- Minimum spanning trees (Kruskal's, Prim's)
- Fractional knapsack

### Time Complexity

| Operation         | Time           |
| ----------------- | -------------- |
| Sort batches      | O(n log n)     |
| Greedy allocation | O(n)           |
| **Total**         | **O(n log n)** |

**Space Complexity**: O(n) for sorted array

### C++ Implementation

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

// Batch structure
struct Batch {
    string batchId;
    string expiry;  // Format: YYYY-MM-DD
    int available;

    Batch(string id, string exp, int avail)
        : batchId(id), expiry(exp), available(avail) {}
};

// Allocation result
struct Allocation {
    string batchId;
    int allocated;
    string expiry;
};

class FEFOAllocator {
private:
    // Compare batches by expiry date (earlier is "less")
    static bool compareByExpiry(const Batch& a, const Batch& b) {
        return a.expiry < b.expiry;
    }

public:
    // Greedy FEFO allocation - O(n log n)
    vector<Allocation> allocate(vector<Batch>& batches, int required) {
        vector<Allocation> allocations;

        // Step 1: Sort batches by expiry (O(n log n))
        cout << "=== Sorting batches by expiry ===" << endl;
        sort(batches.begin(), batches.end(), compareByExpiry);

        for (const auto& batch : batches) {
            cout << batch.batchId << " (Expiry: " << batch.expiry
                 << ", Available: " << batch.available << ")" << endl;
        }

        // Step 2: Greedy allocation (O(n))
        cout << "\n=== Greedy Allocation ===" << endl;
        int remaining = required;

        for (auto& batch : batches) {
            if (remaining <= 0) break;

            // Greedy choice: Take as much as possible from earliest expiry
            int allocateQty = min(remaining, batch.available);

            if (allocateQty > 0) {
                allocations.push_back({batch.batchId, allocateQty, batch.expiry});
                batch.available -= allocateQty;
                remaining -= allocateQty;

                cout << "Allocated " << allocateQty << " units from "
                     << batch.batchId << " (Expiry: " << batch.expiry << ")" << endl;
                cout << "Remaining needed: " << remaining << endl;
            }
        }

        // Check if fully allocated
        if (remaining > 0) {
            cout << "\n⚠️ WARNING: Could not fully allocate. Short by "
                 << remaining << " units" << endl;
        } else {
            cout << "\n✓ Fully allocated from " << allocations.size()
                 << " batches" << endl;
        }

        return allocations;
    }

    // Display allocation summary
    void displayAllocations(const vector<Allocation>& allocations) {
        cout << "\n=== Allocation Summary ===" << endl;
        int total = 0;
        for (const auto& alloc : allocations) {
            cout << alloc.batchId << ": " << alloc.allocated
                 << " units (Expiry: " << alloc.expiry << ")" << endl;
            total += alloc.allocated;
        }
        cout << "Total allocated: " << total << " units" << endl;
    }
};

// Example usage
int main() {
    // Create batches for Paracetamol 500mg
    vector<Batch> batches = {
        Batch("B2024-045", "2025-12-31", 150),  // Latest expiry
        Batch("B2024-001", "2025-03-15", 50),   // Earliest expiry
        Batch("B2024-023", "2025-06-20", 100),  // Middle expiry
    };

    cout << "=== FEFO Allocation Demo ===" << endl;
    cout << "Required: 80 units of Paracetamol 500mg\n" << endl;

    FEFOAllocator allocator;
    vector<Allocation> result = allocator.allocate(batches, 80);

    allocator.displayAllocations(result);

    cout << "\n=== Why FEFO? ===" << endl;
    cout << "✓ Batch B2024-001 (expires 2025-03-15) used first" << endl;
    cout << "✓ Batch B2024-023 (expires 2025-06-20) used next" << endl;
    cout << "✓ Batch B2024-045 (expires 2025-12-31) preserved" << endl;
    cout << "✓ Minimizes wastage by using near-expiry stock first" << endl;

    return 0;
}
```

### Key Concepts

1. **Greedy Choice**: Always select earliest expiry
2. **Optimal Substructure**: Local optimum → Global optimum
3. **Sorting Required**: Must sort before greedy selection
4. **Wastage Minimization**: Near-expiry medicines used first
5. **No Backtracking**: Greedy never reconsiders choices

---

## 4. Append-Only Log with Hash Chain (Audit)

### Purpose

**Immutable audit trail** with tamper detection using cryptographic hash linking (blockchain-style).

### Theory

An **append-only log** is a data structure where entries can only be added, never modified or deleted. Each entry contains a hash of the previous entry, forming a chain. Any modification breaks the chain.

**Hash Chain:**

```
Entry[i].hash = H(Entry[i].data + Entry[i-1].hash)
```

### Use Cases

- Blockchain (Bitcoin, Ethereum)
- Audit logs (compliance, security)
- Version control systems (Git)
- Certificate transparency logs
- Event sourcing

### Time Complexity

| Operation    | Time |
| ------------ | ---- |
| Append       | O(1) |
| Verify chain | O(n) |
| Search       | O(n) |

**Space Complexity**: O(n)

### C++ Implementation

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include <sstream>
#include <iomanip>
using namespace std;

// Simple hash function (for demonstration - use SHA-256 in production)
string simpleHash(const string& data) {
    unsigned long hash = 5381;
    for (char c : data) {
        hash = ((hash << 5) + hash) + c;
    }

    stringstream ss;
    ss << hex << setw(8) << setfill('0') << (hash & 0xFFFFFFFF);
    return ss.str();
}

// Audit log entry structure
struct LogEntry {
    string timestamp;
    string action;
    string entity;
    string user;
    string details;
    string previousHash;
    string hash;

    LogEntry(string act, string ent, string usr, string det, string prevHash)
        : action(act), entity(ent), user(usr), details(det), previousHash(prevHash) {

        // Generate timestamp
        time_t now = time(0);
        timestamp = ctime(&now);
        timestamp.pop_back();  // Remove newline

        // Calculate hash of this entry
        string dataToHash = timestamp + action + entity + user + details + previousHash;
        hash = simpleHash(dataToHash);
    }

    void display() const {
        cout << "┌─────────────────────────────────────┐" << endl;
        cout << "│ Hash: " << hash << setw(15) << "│" << endl;
        cout << "├─────────────────────────────────────┤" << endl;
        cout << "│ Time: " << timestamp << "│" << endl;
        cout << "│ Action: " << action << setw(28 - action.length()) << "│" << endl;
        cout << "│ Entity: " << entity << setw(28 - entity.length()) << "│" << endl;
        cout << "│ User: " << user << setw(30 - user.length()) << "│" << endl;
        cout << "│ Prev: " << previousHash << setw(15) << "│" << endl;
        cout << "└─────────────────────────────────────┘" << endl;
    }
};

class AppendOnlyLog {
private:
    vector<LogEntry> entries;
    const string GENESIS_HASH = "00000000";  // First entry's previous hash

public:
    // Append new entry - O(1)
    void append(string action, string entity, string user, string details) {
        string previousHash = entries.empty() ? GENESIS_HASH : entries.back().hash;

        LogEntry entry(action, entity, user, details, previousHash);
        entries.push_back(entry);

        cout << "✓ Appended entry #" << entries.size() << endl;
        entry.display();
    }

    // Verify chain integrity - O(n)
    bool verifyChain() {
        cout << "\n=== Verifying Hash Chain ===" << endl;

        for (size_t i = 0; i < entries.size(); i++) {
            // Check first entry
            if (i == 0) {
                if (entries[i].previousHash != GENESIS_HASH) {
                    cout << "✗ First entry doesn't link to genesis" << endl;
                    return false;
                }
            } else {
                // Check if this entry's previousHash matches actual previous hash
                if (entries[i].previousHash != entries[i-1].hash) {
                    cout << "✗ Chain broken at entry #" << i + 1 << endl;
                    cout << "  Expected: " << entries[i-1].hash << endl;
                    cout << "  Found: " << entries[i].previousHash << endl;
                    return false;
                }
            }

            cout << "✓ Entry #" << i + 1 << " verified" << endl;
        }

        cout << "✓ Chain is valid! All " << entries.size() << " entries verified" << endl;
        return true;
    }

    // Attempt to tamper (will break chain)
    void tamperEntry(int index, string newDetails) {
        if (index < 0 || index >= entries.size()) {
            cout << "Invalid index" << endl;
            return;
        }

        cout << "\n⚠️ TAMPERING: Modifying entry #" << index + 1 << endl;
        cout << "Old details: " << entries[index].details << endl;
        cout << "New details: " << newDetails << endl;

        entries[index].details = newDetails;
        // Note: Hash is NOT recalculated (simulating tampering)

        cout << "⚠️ Entry modified but hash unchanged!" << endl;
    }

    void displayAll() {
        cout << "\n=== Audit Log (Total: " << entries.size() << " entries) ===" << endl;
        for (size_t i = 0; i < entries.size(); i++) {
            cout << "\nEntry #" << i + 1 << ":" << endl;
            entries[i].display();
        }
    }

    int size() const {
        return entries.size();
    }
};

// Example usage
int main() {
    AppendOnlyLog auditLog;

    cout << "=== Append-Only Log Demo ===" << endl;

    // Add audit entries
    auditLog.append("Login", "User", "admin", "Admin logged in successfully");
    auditLog.append("Create", "Medicine", "admin", "Added Paracetamol 500mg");
    auditLog.append("Update", "Medicine", "pharmacist", "Updated Aspirin stock");
    auditLog.append("Dispense", "Prescription", "pharmacist", "Dispensed PRX-001");

    // Display all entries
    auditLog.displayAll();

    // Verify chain integrity
    bool isValid = auditLog.verifyChain();

    // Attempt to tamper
    auditLog.tamperEntry(1, "Added FAKE Medicine");

    // Verify again (should fail)
    cout << "\n=== After Tampering ===" << endl;
    isValid = auditLog.verifyChain();

    return 0;
}
```

### Key Concepts

1. **Immutability**: Entries cannot be modified or deleted
2. **Hash Chain**: Each entry links to previous via hash
3. **Tamper Evidence**: Any change breaks the chain
4. **Blockchain Similarity**: Same principle as Bitcoin
5. **O(1) Append**: Very efficient for logging
6. **O(n) Verification**: Must check all links

---

## Comparison of All Algorithms

| Algorithm       | Data Structure | Time (Main Op) | Space | Best For        |
| --------------- | -------------- | -------------- | ----- | --------------- |
| Hash Table      | Array + Lists  | O(1)           | O(n)  | Fast lookup     |
| Min-Heap        | Complete Tree  | O(log n)       | O(n)  | Priority queues |
| Greedy FEFO     | Sorted Array   | O(n log n)     | O(n)  | Optimization    |
| Append-Only Log | Array/List     | O(1) append    | O(n)  | Audit trails    |

## Learning Path

1. **Start with Hash Table** - Simplest, constant time operations
2. **Move to Min-Heap** - Introduces tree structures and logarithmic time
3. **Try Greedy Algorithm** - Understand optimization and sorting
4. **Explore Hash Chain** - Advanced: cryptography and blockchain concepts

## Practice Problems

### Hash Table

- Implement open addressing instead of chaining
- Add a resize() function when load factor > 0.75
- Create a perfect hash function for medicine codes

### Min-Heap

- Implement max-heap for reverse priority
- Add decrease-key operation
- Heap sort implementation

### Greedy Algorithm

- Implement FIFO allocation
- Add multi-medicine batch allocation
- Handle priority-based allocation (emergency first)

### Append-Only Log

- Use SHA-256 instead of simple hash
- Implement Merkle tree for faster verification
- Add distributed consensus (simplified blockchain)

---

**For interactive visualizations, use the "View Algorithm" buttons in the application!** 🚀
