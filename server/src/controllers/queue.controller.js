const { ok } = require('../utils/ApiResponse');
const { enqueuePrescription, getQueueSnapshot, callNext } = require('../services/queue.service');

async function enqueueController(req, res) {
  const { prescriptionId, priority } = req.body;
  const entry = await enqueuePrescription({ prescriptionId, priority });
  return res.status(201).json(ok('Enqueued', entry));
}

async function snapshotController(req, res) {
  const lanes = await getQueueSnapshot();
  return res.json(ok('Queue snapshot', { lanes }));
}

async function callNextController(req, res) {
  const next = await callNext();
  if (!next) return res.json(ok('Queue empty', null));
  return res.json(ok('Called next', next));
}

module.exports = { enqueueController, snapshotController, callNextController };