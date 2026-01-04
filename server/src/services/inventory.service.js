const Medicine = require("../models/Medicine.model.js");
const Batch = require("../models/Batch.model.js");
const { HashTable } = require("../dsa/HashTable");

const cache = new HashTable();

async function getMedicineByCode(code) {
  const key = String(code).trim().toUpperCase();
  const cached = cache.get(key);
  if (cached) return cached;
  const med = await Medicine.findOne({ code: key }).lean();
  if (med) cache.set(key, med);
  return med;
}

async function getBatchesForMedicine(medicineId) {
  return Batch.find({ medicineId })
    .sort({ expiryDate: 1, receivedDate: 1 })
    .lean();
}

async function getAllMedicines() {
  const medicines = await Medicine.find().sort({ name: 1 }).lean();

  // Calculate total stock for each medicine from batches
  const medicinesWithStock = await Promise.all(
    medicines.map(async (med) => {
      const stockAgg = await Batch.aggregate([
        { $match: { medicineId: med._id } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      return {
        ...med,
        totalStock: stockAgg[0]?.total || 0,
      };
    })
  );

  return medicinesWithStock;
}

async function createMedicine(data, userId) {
  const existing = await Medicine.findOne({ code: data.code });
  if (existing) throw new Error("Medicine code already exists");
  const med = await Medicine.create({ ...data, createdBy: userId });
  cache.set(med.code, med);

  // Create initial batch if provided
  if (data.initialBatch) {
    await Batch.create({
      medicineId: med._id,
      batchNumber: data.initialBatch.batchNumber || `BATCH-${med.code}-001`,
      quantity: data.initialBatch.quantity || 0,
      expiryDate:
        data.initialBatch.expiryDate ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      receivedDate: data.initialBatch.receivedDate || new Date(),
      costPrice: data.initialBatch.costPrice || med.unitPrice * 0.6,
      isExpired: false,
    });
  }

  return med;
}

async function createBatch(data) {
  const medicine = await Medicine.findById(data.medicineId);
  if (!medicine) throw new Error("Medicine not found");

  const batch = await Batch.create({
    medicineId: data.medicineId,
    batchNumber: data.batchNumber,
    quantity: data.quantity,
    expiryDate: data.expiryDate,
    receivedDate: data.receivedDate || new Date(),
    costPrice: data.costPrice || medicine.unitPrice * 0.6,
    isExpired: false,
  });
  return batch;
}

async function updateMedicine(medicineId, data) {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) throw new Error("Medicine not found");

  // If code is being changed, check for duplicates
  if (data.code && data.code !== medicine.code) {
    const existing = await Medicine.findOne({ code: data.code });
    if (existing) throw new Error("Medicine code already exists");
    // Remove old code from cache
    cache.delete(medicine.code);
  }

  // Update medicine
  Object.assign(medicine, data);
  await medicine.save();

  // Update cache
  cache.set(medicine.code, medicine);
  return medicine;
}

async function getExpiringBatches(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return Batch.find({
    expiryDate: { $lte: futureDate },
    quantity: { $gt: 0 },
  })
    .populate("medicineId", "name code")
    .sort({ expiryDate: 1 })
    .lean();
}

module.exports = {
  getMedicineByCode,
  getAllMedicines,
  createMedicine,
  updateMedicine,
  createBatch,
  getBatchesForMedicine,
  getExpiringBatches,
};
