# API Reference

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

### Login

```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "user": { username, role },
  "token": "jwt_token"
}
```

**Headers** (all protected endpoints):

```
Authorization: Bearer <token>
```

---

## Prescriptions

### Create Prescription

```
POST /prescriptions
Authorization: Bearer token
Content-Type: application/json

{
  "patientId": "ObjectId",
  "items": [
    {
      "medicineId": "ObjectId",
      "quantity": 10,
      "dosage": "500mg",
      "instruction": "Twice daily"
    }
  ],
  "priority": 1,  // 0=Emergency, 1=High, 2=Normal, 3=Low
  "notes": "Optional notes"
}

Response: Prescription object with status="draft"
```

### Get All Prescriptions

```
GET /prescriptions?status=queued&priority=1&patientId=xyz
Authorization: Bearer token

Response: Array of prescriptions with populated patient & medicine details
```

### Get Single Prescription

```
GET /prescriptions/:prescriptionId
Authorization: Bearer token

Response: Complete prescription with all details
```

### Update Prescription Status

```
PATCH /prescriptions/:prescriptionId/status
Authorization: Bearer token
Content-Type: application/json

{
  "status": "queued"  // or "dispensed"
}
```

---

## Queue

### Get Queue Snapshot

```
GET /queue/snapshot
Authorization: Bearer token

Response:
{
  "queue": [
    {
      prescriptionId: {...with patient & items},
      priority: 0,
      status: "waiting",
      createdAt: Date
    }
  ],
  "total": 5,
  "priorities": {
    "emergency": 2,
    "high": 1,
    "normal": 1,
    "low": 1
  }
}
```

### Call Next Patient

```
POST /queue/next
Authorization: Bearer token

Response: QueueEntry with prescription details
```

### Update Queue Entry

```
PATCH /queue/:entryId
Authorization: Bearer token

{
  "status": "called"  // or "completed"
}
```

---

## Dispense

### Get Prescription for Dispense

```
GET /dispense/:prescriptionId
Authorization: Bearer token

Response:
{
  prescription: {...},
  availableBatches: {
    medicineId: [
      {batchId, quantity, expiryDate}
    ]
  }
}
```

### Process Dispense (FEFO Allocation)

```
POST /dispense
Authorization: Bearer token
Content-Type: application/json

{
  "prescriptionId": "ObjectId",
  "pharmacistId": "ObjectId"
}

Response:
{
  "dispenseId": "ObjectId",
  "status": "success" | "partial",
  "allocations": [
    {itemId, batchId, quantityDispensed}
  ],
  "bill": {billId, totalAmount, finalAmount}
}
```

### Get All Dispense Records

```
GET /dispense?status=success&limit=20&skip=0
Authorization: Bearer token

Response: Array of dispense records with full details
```

### Get Dispense Details

```
GET /dispense/:dispenseId
Authorization: Bearer token

Response: Complete dispense record with bill
```

---

## Inventory

### Get All Medicines

```
GET /inventory/medicines?search=aspirin&limit=50
Authorization: Bearer token

Response: Array of medicines with stock levels
```

### Get Medicine Details

```
GET /inventory/medicines/:medicineId
Authorization: Bearer token

Response:
{
  medicine: {...},
  batches: [{batchId, quantity, expiryDate}],
  totalStock: 100,
  stockStatus: "normal"  // "critical" | "low" | "normal"
}
```

### Add Medicine

```
POST /inventory/medicines
Authorization: Bearer token (admin only)
Content-Type: application/json

{
  "name": "Aspirin",
  "code": "MED010",
  "strength": "500mg",
  "manufacturer": "Bayer",
  "costPrice": 2.5,
  "salePrice": 5.0,
  "description": "Pain reliever"
}

Response: Medicine object
```

### Add Batch

```
POST /inventory/batches
Authorization: Bearer token
Content-Type: application/json

{
  "medicineId": "ObjectId",
  "batchNumber": "BATCH001",
  "quantity": 100,
  "expiryDate": "2026-12-31",
  "purchaseDate": "2024-01-15",
  "supplierId": "ObjectId"
}

Response: Batch object
```

### Update Batch Quantity

```
PATCH /inventory/batches/:batchId
Authorization: Bearer token
Content-Type: application/json

{
  "quantity": 75  // After dispense
}

Response: Updated batch
```

---

## Dashboard

### Get Dashboard Metrics

```
GET /dashboard/metrics
Authorization: Bearer token

Response:
{
  "totalStock": 500,
  "lowStock": 45,
  "criticalStock": 15,
  "inQueue": 3,
  "todayRevenue": 2500,
  "todayBillCount": 8,
  "queuePriorities": {
    "emergency": 1,
    "high": 1,
    "normal": 1,
    "low": 0
  }
}
```

---

## History (Audit Trail)

### Get Dispense History

```
GET /history/dispense?limit=20&skip=0&status=success
Authorization: Bearer token

Response:
{
  "records": [
    {
      dispenseId,
      prescriptionId: {patientName, items},
      status: "success" | "partial",
      dispensedAt,
      bill: {totalAmount, status}
    }
  ],
  "total": 45,
  "logs": [
    {action, timestamp, previousHash, currentHash}
  ]
}
```

### Get Single Dispense with Bill

```
GET /history/dispense/:dispenseId
Authorization: Bearer token

Response:
{
  dispense: {...full details...},
  bill: {...payment details...},
  auditLog: {hash chain entry}
}
```

### Verify Hash Chain

```
POST /history/verify
Authorization: Bearer token
Content-Type: application/json

{
  "startId": "ObjectId",
  "endId": "ObjectId"
}

Response:
{
  "valid": true | false,
  "chainLength": 10,
  "tamperedAt": null  // or index if detected
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Invalid quantity", "Medicine not found"]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Details for debugging"
}
```

---

## Status Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad request (validation error) |
| 401  | Unauthorized (no token)        |
| 403  | Forbidden (no permission)      |
| 404  | Not found                      |
| 500  | Server error                   |

---

## Enum Values

### Prescription Status

- `draft` - Initial creation
- `queued` - In queue, waiting for dispense
- `dispensed` - Completed

### Priority Levels

- `0` - Emergency (red)
- `1` - High (orange)
- `2` - Normal (yellow)
- `3` - Low (blue)

### Dispense Status

- `success` - All medicines dispensed
- `partial` - Some medicines dispensed, some backorder

### Queue Entry Status

- `waiting` - In queue
- `called` - Called to counter
- `completed` - Dispensed

### Bill Status

- `paid` - Payment received
- `pending` - Awaiting payment

### User Roles

- `admin` - Full access
- `pharmacist` - Dispense & queue access
- `viewer` - Read-only access

---

## Rate Limiting

**Not implemented** in development. In production:

- 100 requests per minute per user
- 1000 requests per minute per IP

---

## Authentication Flow

```
1. Client calls POST /auth/login
2. Server validates credentials
3. Server returns JWT token
4. Client stores token (localStorage/session)
5. Client includes token in Authorization header
6. Server validates token on each request
7. If expired, client requests new token
```

---

## Example Usage

### Create Prescription & Auto-Queue

```bash
# 1. Create prescription
curl -X POST http://localhost:5000/api/prescriptions \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "...",
    "items": [{medicineId: "...", quantity: 10, dosage: "500mg"}],
    "priority": 1
  }'

# Response includes prescriptionId

# 2. Get queue (prescription auto-appears)
curl -X GET http://localhost:5000/api/queue/snapshot \
  -H "Authorization: Bearer token"

# 3. Call next patient
curl -X POST http://localhost:5000/api/queue/next \
  -H "Authorization: Bearer token"

# 4. Dispense medicine
curl -X POST http://localhost:5000/api/dispense \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"prescriptionId": "...", "pharmacistId": "..."}'

# 5. View history
curl -X GET http://localhost:5000/api/history/dispense \
  -H "Authorization: Bearer token"
```

---

**Last Updated**: Jan 2026
