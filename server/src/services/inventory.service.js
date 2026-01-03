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
  return Medicine.find().sort({ name: 1 }).lean();
}

async function createMedicine(data, userId) {
  const existing = await Medicine.findOne({ code: data.code });
  if (existing) throw new Error("Medicine code already exists");
  const med = await Medicine.create({ ...data, createdBy: userId });
  cache.set(med.code, med);
  return med;
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
  getBatchesForMedicine,
  getExpiringBatches,
};
