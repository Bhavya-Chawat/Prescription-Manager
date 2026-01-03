const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');
const { loginController, signupController } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', validate(loginSchema), asyncHandler(loginController));
router.post('/signup', asyncHandler(signupController)); // Add validation later if needed

module.exports = router;