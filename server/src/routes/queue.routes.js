const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate.middleware');
const { auth } = require('../middleware/auth.middleware');
const { enqueueSchema } = require('../validators/queue.validator');
const { enqueueController, snapshotController, callNextController } = require('../controllers/queue.controller');

const router = express.Router();

router.post('/', auth, validate(enqueueSchema), asyncHandler(enqueueController));
router.get('/', auth, asyncHandler(snapshotController));
router.post('/next', auth, asyncHandler(callNextController));

module.exports = router;