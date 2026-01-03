const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate.middleware');
const { auth } = require('../middleware/auth.middleware');
const { getMedicineByCodeSchema, getExpiringBatchesSchema } = require('../validators/inventory.validator');
const { 
  getMedicineByCodeController, 
  getExpiringBatchesController, 
  getAllMedicinesController, 
  createMedicineController 
} = require('../controllers/inventory.controller');

const router = express.Router();

router.get('/medicines', auth, asyncHandler(getAllMedicinesController));
router.post('/medicines', auth, asyncHandler(createMedicineController)); // Add validation schema later
router.get('/medicines/:code', auth, validate(getMedicineByCodeSchema), asyncHandler(getMedicineByCodeController));
router.get('/batches/expiring', auth, validate(getExpiringBatchesSchema), asyncHandler(getExpiringBatchesController));

module.exports = router;