const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate.middleware');
const { auth } = require('../middleware/auth.middleware');
const { createPrescriptionSchema, getPrescriptionSchema } = require('../validators/prescription.validator');
const { createPrescriptionController, getPrescriptionController, getAllPrescriptionsController } = require('../controllers/prescription.controller');

const router = express.Router();

router.post('/', auth, validate(createPrescriptionSchema), asyncHandler(createPrescriptionController));
router.get('/', auth, asyncHandler(getAllPrescriptionsController));
router.get('/:id', auth, validate(getPrescriptionSchema), asyncHandler(getPrescriptionController));

module.exports = router;