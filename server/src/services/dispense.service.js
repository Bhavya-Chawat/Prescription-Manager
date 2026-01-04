const Dispense = require("../models/Dispense.model.js");
const Batch = require("../models/Batch.model.js");
const Prescription = require("../models/Prescription.model.js");
const Medicine = require("../models/Medicine.model.js");
const Bill = require("../models/Bill.model.js");
const { greedyAllocate } = require("../dsa/GreedyAllocator");

async function processDispense(prescriptionId) {
  const prescription = await Prescription.findById(prescriptionId).lean();
  if (!prescription) throw new Error("Prescription not found");

  // Check if already dispensed
  if (prescription.status === "dispensed") {
    throw new Error("This prescription has already been dispensed");
  }

  const itemsResult = [];
  const backorderItems = [];
  const billItems = [];

  for (const item of prescription.items) {
    const batches = await Batch.find({
      medicineId: item.medicineId,
      quantity: { $gt: 0 },
    })
      .sort({ expiryDate: 1, receivedDate: 1 })
      .lean();

    const normalized = batches.map((b) => ({
      batchId: b._id,
      availableQty: b.quantity,
      expiryDate: b.expiryDate,
    }));

    const { allocations, remaining } = greedyAllocate(
      item.quantity,
      normalized
    );

    // Get medicine details for billing
    const medicine = await Medicine.findById(item.medicineId).lean();

    // Persist batch reductions
    for (const alloc of allocations) {
      await Batch.findByIdAndUpdate(alloc.batchId, {
        $inc: { quantity: -alloc.quantity },
      });
      itemsResult.push({
        medicineId: item.medicineId,
        requested: item.quantity,
        allocated: alloc.quantity,
        batchId: alloc.batchId,
        isPartial: remaining > 0,
      });

      // Add to bill items
      if (medicine) {
        billItems.push({
          name: medicine.name,
          quantity: alloc.quantity,
          unitPrice: medicine.unitPrice || 0,
          total: (medicine.unitPrice || 0) * alloc.quantity,
        });
      }
    }

    if (remaining > 0) {
      backorderItems.push({ medicineId: item.medicineId, quantity: remaining });
    }
  }

  // Create dispense record
  const dispense = await Dispense.create({
    prescriptionId,
    items: itemsResult,
    backorderItems,
    status: backorderItems.length ? "partial" : "full",
  });

  // Create bill
  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
  const bill = await Bill.create({
    dispenseId: dispense._id,
    items: billItems,
    subtotal,
    discount: 0,
    total: subtotal,
    status: "paid", // Automatically mark as paid for demo
  });

  await Prescription.findByIdAndUpdate(prescriptionId, { status: "dispensed" });

  // Mark queue entry as completed
  const QueueEntry = require("../models/QueueEntry.model.js");
  await QueueEntry.updateOne(
    { prescriptionId, status: { $in: ["waiting", "called"] } },
    { status: "completed", completedAt: new Date() }
  );

  return { dispense, bill };
}

module.exports = { processDispense };
