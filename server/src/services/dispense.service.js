const Dispense = require("../models/Dispense.model.js");
const Batch = require("../models/Batch.model.js");
const Prescription = require("../models/Prescription.model.js");
const { greedyAllocate } = require("../dsa/GreedyAllocator");

async function processDispense(prescriptionId) {
  const prescription = await Prescription.findById(prescriptionId).lean();
  if (!prescription) throw new Error("Prescription not found");

  const itemsResult = [];
  const backorderItems = [];

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
    }

    if (remaining > 0) {
      backorderItems.push({ medicineId: item.medicineId, quantity: remaining });
    }
  }

  const dispense = await Dispense.create({
    prescriptionId,
    items: itemsResult,
    backorderItems,
    status: backorderItems.length ? "partial" : "full",
  });
  await Prescription.findByIdAndUpdate(prescriptionId, { status: "dispensed" });
  return dispense;
}

module.exports = { processDispense };
