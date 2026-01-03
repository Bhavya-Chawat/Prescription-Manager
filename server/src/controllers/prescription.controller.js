const { ok } = require('../utils/ApiResponse');
const { createPrescription, getPrescription, getAllPrescriptions } = require('../services/prescription.service');

async function createPrescriptionController(req, res) {
  const { patientId, patientName, doctor, department, items } = req.body;
  const doc = await createPrescription({ patientId, patientName, doctor, department, items });
  return res.status(201).json(ok('Prescription created', doc));
}

async function getPrescriptionController(req, res) {
  const { id } = req.params;
  const doc = await getPrescription(id);
  if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
  return res.json(ok('Prescription fetched', doc));
}

async function getAllPrescriptionsController(req, res) {
  const docs = await getAllPrescriptions();
  return res.json(ok('Prescriptions fetched', docs));
}

module.exports = { createPrescriptionController, getPrescriptionController, getAllPrescriptionsController };