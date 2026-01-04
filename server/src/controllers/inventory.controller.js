const { ok } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const {
  getMedicineByCode,
  getExpiringBatches,
  getAllMedicines,
  createMedicine,
  updateMedicine,
  createBatch,
  getBatchesForMedicine,
} = require("../services/inventory.service");

async function getMedicineByCodeController(req, res, next) {
  const { code } = req.params;
  const med = await getMedicineByCode(code);
  if (!med) return next(new ApiError(404, "Medicine not found"));
  return res.json(ok(med, "Medicine fetched"));
}

async function getAllMedicinesController(req, res) {
  const meds = await getAllMedicines();
  return res.json(ok(meds, "Medicines fetched"));
}

async function createMedicineController(req, res, next) {
  try {
    const med = await createMedicine(req.body, req.user.id);
    return res.json(ok("Medicine created", med));
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
}

async function updateMedicineController(req, res, next) {
  try {
    const { medicineId } = req.params;
    const medicine = await updateMedicine(medicineId, req.body);
    return res.json(ok(medicine, "Medicine updated"));
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
}

async function createBatchController(req, res, next) {
  try {
    const batch = await createBatch(req.body);
    return res.json(ok("Batch created", batch));
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
}

async function getBatchesForMedicineController(req, res) {
  const { medicineId } = req.params;
  const batches = await getBatchesForMedicine(medicineId);
  return res.json(ok(batches, "Batches fetched"));
}

async function getExpiringBatchesController(req, res) {
  const days = Number(req.query.days || 30);
  const batches = await getExpiringBatches(days);
  return res.json(ok("Expiring batches", { days, batches }));
}

module.exports = {
  getMedicineByCodeController,
  getAllMedicinesController,
  createMedicineController,
  updateMedicineController,
  createBatchController,
  getBatchesForMedicineController,
  getExpiringBatchesController,
};
