const { ok } = require('../utils/ApiResponse');
const { processDispense } = require('../services/dispense.service');

async function processDispenseController(req, res) {
  const { prescriptionId } = req.params;
  const record = await processDispense(prescriptionId);
  return res.status(201).json(ok('Dispense processed', record));
}

module.exports = { processDispenseController };