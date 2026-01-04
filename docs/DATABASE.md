# Database Schema Reference

## Models Overview

```
User          ← Authentication & authorization
Patient       ← Demographics
Medicine      ← Catalog
Batch         ← Stock tracking
Prescription  ← Patient orders
QueueEntry    ← Priority queue
Dispense      ← Fulfillment
Bill          ← Payments
AuditLog      ← History
Supplier      ← Sources
```

---

## Model Details

### User

Authentication and role-based access control.

```javascript
{
  _id: ObjectId,
  username: String,          // Unique login
  passwordHash: String,      // bcrypt hashed
  role: Enum,                // "admin" | "pharmacist" | "viewer"
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `username` (unique)

---

### Patient

Patient demographics and medical history.

```javascript
{
  _id: ObjectId,
  name: String,              // Full name
  phone: String,             // Contact
  email: String,             // Email
  age: Number,               // Years
  bloodGroup: String,        // e.g., "O+"
  location: String,          // Address
  medicalHistory: String,    // Pre-existing conditions
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `name`, `phone`, `email`

---

### Medicine

Medicine catalog with pricing.

```javascript
{
  _id: ObjectId,
  name: String,              // e.g., "Crocin"
  code: String,              // e.g., "MED001" (unique)
  strength: String,          // e.g., "500mg"
  manufacturer: String,
  costPrice: Number,         // Purchase price per unit
  salePrice: Number,         // Selling price per unit
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `code` (unique), `name`

---

### Batch

Stock tracking with expiry dates.

```javascript
{
  _id: ObjectId,
  medicineId: ObjectId,      // Reference to Medicine
  batchNumber: String,       // Supplier batch code
  quantity: Number,          // Current stock
  expiryDate: Date,          // FEFO sorting key
  purchaseDate: Date,
  supplierId: ObjectId,      // Reference to Supplier
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `medicineId`, `expiryDate`, `supplierId`

---

### Prescription

Patient prescriptions (linked list of items).

```javascript
{
  _id: ObjectId,
  patientId: ObjectId,       // Reference to Patient
  prescriptionDate: Date,
  status: Enum,              // "draft" → "queued" → "dispensed"
  priority: Number,          // 0=Emergency, 1=High, 2=Normal, 3=Low
  items: [{
    _id: ObjectId,           // Unique item ID
    medicineId: ObjectId,    // Reference to Medicine
    quantity: Number,        // Units required
    dosage: String,          // e.g., "500mg"
    instruction: String,     // e.g., "Twice daily"
  }],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `patientId`, `status`, `priority`

---

### QueueEntry

Priority queue entries for dispense workflow.

```javascript
{
  _id: ObjectId,
  prescriptionId: ObjectId,  // Reference to Prescription
  priority: Number,          // Min-heap priority level
  status: Enum,              // "waiting" → "called" → "completed"
  calledAt: Date,            // When called to counter
  completedAt: Date,         // When dispensed
  pharmacistId: ObjectId,    // Who processed
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `prescriptionId`, `status`, `priority`

---

### Dispense

Fulfillment records with allocations.

```javascript
{
  _id: ObjectId,
  prescriptionId: ObjectId,  // Reference to Prescription (with nested patient)
  status: Enum,              // "success" | "partial" (quantity not met)
  allocations: [{
    itemId: ObjectId,        // Reference to prescription item
    batchId: ObjectId,       // Batch used for this item
    quantityDispensed: Number,
    quantityRemaining: Number,
  }],
  backorders: [{
    medicineId: ObjectId,
    quantityBackordered: Number,
  }],
  dispensedAt: Date,
  pharmacistId: ObjectId,    // Who dispensed
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `prescriptionId`, `status`

---

### Bill

Payment records linked to dispense.

```javascript
{
  _id: ObjectId,
  dispenseId: ObjectId,      // Reference to Dispense
  patientId: ObjectId,       // Reference to Patient
  totalAmount: Number,       // Sum of items
  discountAmount: Number,    // If applicable
  finalAmount: Number,       // totalAmount - discount
  status: Enum,              // "paid" | "pending"
  paymentMethod: String,     // "cash" | "card" | "upi"
  paymentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `dispenseId`, `patientId`, `status`

---

### AuditLog

Immutable audit trail with hash chain.

```javascript
{
  _id: ObjectId,
  action: Enum,              // "CREATE", "DISPENSE", "DELETE"
  entityType: String,        // "Prescription", "Dispense"
  entityId: ObjectId,        // ID of affected entity
  userId: ObjectId,          // Who performed action
  previousHash: String,      // SHA256 of previous record
  currentHash: String,       // SHA256 of this record
  details: {
    before: Object,          // Previous state
    after: Object,           // New state
  },
  ipAddress: String,
  timestamp: Date,
  createdAt: Date
}
```

**Indexes**: `entityId`, `action`, `timestamp`

**Hash Chain**: `previousHash` links records sequentially

---

### Supplier

Medicine suppliers.

```javascript
{
  _id: ObjectId,
  name: String,              // Supplier name
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  paymentTerms: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**: `name`, `phone`

---

## Relationships Diagram

```
                    ┌─────────────┐
                    │    User     │
                    └────────┬────┘
                             │ (creates)
                    ┌────────▼────────┐
                    │   AuditLog      │  ◄─ Hash chain
                    │ (Immutable)     │
                    └─────────────────┘

                    ┌─────────────┐
                    │   Patient   │
                    └────────┬────┘
                             │ (has)
                    ┌────────▼──────────┐
                    │ Prescription      │  ◄─ Linked list items
                    │ (Status: draft→   │
                    │  queued→dispensed)│
                    └────────┬──────────┘
                             │ (has)
                    ┌────────▼─────────┐
                    │  QueueEntry      │  ◄─ Min-heap
                    │ (Priority order) │
                    └──────────────────┘
                             ▼
                    ┌──────────────────┐
                    │  Dispense        │  ◄─ FEFO allocation
                    │  (Allocations)   │
                    └────┬─────────────┘
                         │ (creates)
                    ┌────▼─────────┐
                    │    Bill      │
                    │ (Payment)    │
                    └──────────────┘

    ┌───────────┐          ┌──────────┐          ┌──────────┐
    │ Medicine  │◄─(ref)───│  Batch   │─(ref)───►│ Supplier │
    │ (Catalog) │          │(Expiry)  │          │(Sources) │
    └───────────┘          └──────────┘          └──────────┘
```

---

## Population Chains

### Prescription with Details

```javascript
Prescription.populate("patientId").populate("items.medicineId");
```

### Queue Snapshot

```javascript
QueueEntry.populate({
  path: "prescriptionId",
  populate: [{ path: "patientId" }, { path: "items.medicineId" }],
}).populate("pharmacistId");
```

### Dispense with Full Details

```javascript
Dispense.populate({
  path: "prescriptionId",
  populate: [{ path: "patientId" }, { path: "items.medicineId" }],
})
  .populate("allocations.batchId")
  .populate("pharmacistId");
```

### Audit Log with Context

```javascript
AuditLog.populate("userId").populate("entityId");
```

---

## Data Constraints

| Model        | Constraint  | Rule                       |
| ------------ | ----------- | -------------------------- |
| User         | Username    | Unique, 3-20 chars         |
| Medicine     | Code        | Unique, format: MED###     |
| Batch        | Quantity    | ≥ 0, non-negative          |
| Prescription | Status      | Enum only                  |
| Dispense     | Allocations | Non-empty array            |
| Bill         | Amount      | ≥ 0, precise to 2 decimals |
| AuditLog     | Hash        | Immutable SHA256           |

---

## Indexes for Performance

```javascript
// User
db.users.createIndex({ username: 1 }, { unique: true });

// Medicine (Hash table optimization)
db.medicines.createIndex({ code: 1 }, { unique: true });
db.medicines.createIndex({ name: 1 });

// Batch (FEFO sorting)
db.batches.createIndex({ expiryDate: 1 });
db.batches.createIndex({ medicineId: 1 });

// Prescription
db.prescriptions.createIndex({ patientId: 1 });
db.prescriptions.createIndex({ status: 1 });
db.prescriptions.createIndex({ priority: 1 });

// Queue (Min-heap operations)
db.queueentries.createIndex({ prescriptionId: 1 }, { unique: true });
db.queueentries.createIndex({ status: 1 });
db.queueentries.createIndex({ priority: 1 });

// Dispense
db.dispenses.createIndex({ prescriptionId: 1 }, { unique: true });

// AuditLog (Hash chain verification)
db.auditlogs.createIndex({ entityId: 1 });
db.auditlogs.createIndex({ timestamp: -1 });
```

---

## Default Data

**Seeded on `npm run seed`**:

- 1 Admin user
- 1 Pharmacist user
- 1 Viewer user
- 10 unique patients
- 6 medicines (3 critical stock, 3 low stock)
- 10 prescriptions
- 5 pre-dispensed (with bills)
- 5 in queue
- 10 audit log entries

---

**Last Updated**: Jan 2026
