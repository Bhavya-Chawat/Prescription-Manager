const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate.middleware');
const { auth } = require('../middleware/auth.middleware');
const { processDispenseSchema } = require('../validators/dispense.validator');
const { processDispenseController } = require('../controllers/dispense.controller');

const router = express.Router();

router.post('/:prescriptionId', auth, validate(processDispenseSchema), asyncHandler(processDispenseController));

module.exports = router;