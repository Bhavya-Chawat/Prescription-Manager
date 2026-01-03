const { ok } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { getMedicineByCode, getExpiringBatches, getAllMedicines, createMedicine } = require('../services/inventory.service');

async function getMedicineByCodeController(req, res, next) {
  const { code } = req.params;
  const med = await getMedicineByCode(code);
  if (!med) return next(new ApiError(404, 'Medicine not found'));
  return res.json(ok('Medicine fetched', med));
}

async function getAllMedicinesController(req, res) {
  const meds = await getAllMedicines();
  return res.json(ok('Medicines fetched', meds));
}

async function createMedicineController(req, res, next) {
  try {
    const med = await createMedicine(req.body, req.user.id);
    return res.json(ok('Medicine created', med));
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
}

async function getExpiringBatchesController(req, res) {
  const days = Number(req.query.days || 30);
  const batches = await getExpiringBatches(days);
  return res.json(ok('Expiring batches', { days, batches }));
}

module.exports = { 
  getMedicineByCodeController, 
  getAllMedicinesController, 
  createMedicineController, 
  getExpiringBatchesController 
};