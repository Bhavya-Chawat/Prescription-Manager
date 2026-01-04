const { ok } = require("../utils/ApiResponse");
const {
  enqueuePrescription,
  getQueueSnapshot,
  callNext,
} = require("../services/queue.service");

async function enqueueController(req, res) {
  const { prescriptionId, priority } = req.body;
  const entry = await enqueuePrescription({ prescriptionId, priority });
  return res.status(201).json(ok(entry, "Enqueued"));
}

async function snapshotController(req, res) {
  const lanes = await getQueueSnapshot();
  return res.json(ok(lanes, "Queue snapshot"));
}

async function callNextController(req, res) {
  const next = await callNext();
  if (!next) return res.json(ok(null, "Queue empty"));
  return res.json(ok(next, "Called next"));
}

module.exports = { enqueueController, snapshotController, callNextController };
