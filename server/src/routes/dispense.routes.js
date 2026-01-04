const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate.middleware");
const { auth } = require("../middleware/auth.middleware");
const { processDispenseSchema } = require("../validators/dispense.validator");
const {
  processDispenseController,
  getAllDispensesController,
  getAllBillsController,
} = require("../controllers/dispense.controller");

const router = express.Router();

router.get("/history", auth, asyncHandler(getAllDispensesController));
router.get("/bills", auth, asyncHandler(getAllBillsController));
router.post(
  "/:prescriptionId",
  auth,
  validate(processDispenseSchema),
  asyncHandler(processDispenseController)
);

module.exports = router;
