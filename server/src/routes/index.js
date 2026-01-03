const express = require('express');

const authRoutes = require('./auth.routes');
const inventoryRoutes = require('./inventory.routes');
const prescriptionRoutes = require('./prescription.routes');
const queueRoutes = require('./queue.routes');
const dispenseRoutes = require('./dispense.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/queue', queueRoutes);
router.use('/dispense', dispenseRoutes);

module.exports = router;