const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate.middleware");
const { auth } = require("../middleware/auth.middleware");
const {
  getMedicineByCodeSchema,
  getExpiringBatchesSchema,
} = require("../validators/inventory.validator");
const {
  getMedicineByCodeController,
  getExpiringBatchesController,
  getAllMedicinesController,
  createMedicineController,
  updateMedicineController,
  createBatchController,
  getBatchesForMedicineController,
} = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/medicines", auth, asyncHandler(getAllMedicinesController));
router.post("/medicines", auth, asyncHandler(createMedicineController));
router.put(
  "/medicines/:medicineId",
  auth,
  asyncHandler(updateMedicineController)
);
router.get(
  "/medicines/:code",
  auth,
  validate(getMedicineByCodeSchema),
  asyncHandler(getMedicineByCodeController)
);
router.get(
  "/batches/expiring",
  auth,
  validate(getExpiringBatchesSchema),
  asyncHandler(getExpiringBatchesController)
);
router.get(
  "/medicines/:medicineId/batches",
  auth,
  asyncHandler(getBatchesForMedicineController)
);
router.post("/batches", auth, asyncHandler(createBatchController));

module.exports = router;
