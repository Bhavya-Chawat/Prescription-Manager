const QueueEntry = require("../models/QueueEntry.model.js");
const Prescription = require("../models/Prescription.model.js");
const { PriorityQueue } = require("../dsa/PriorityQueue");

async function enqueuePrescription({ prescriptionId, priority }) {
  const entry = await QueueEntry.create({
    prescriptionId,
    priority,
    status: "waiting",
    enqueuedAt: new Date(),
  });
  await Prescription.findByIdAndUpdate(prescriptionId, { status: "queued" });
  return entry;
}

async function getQueueSnapshot() {
  const waiting = await QueueEntry.find({ status: "waiting" })
    .sort({ priority: 1, enqueuedAt: 1 })
    .lean();
  const pq = new PriorityQueue(4);
  waiting.forEach((e) => pq.push(e.priority, e));
  return pq.snapshot();
}

async function callNext() {
  const waiting = await QueueEntry.find({ status: "waiting" })
    .sort({ priority: 1, enqueuedAt: 1 })
    .lean();
  const pq = new PriorityQueue(4);
  waiting.forEach((e) => pq.push(e.priority, e));
  const res = pq.popNext();
  if (!res) return null;
  const { item } = res;
  const updated = await QueueEntry.findByIdAndUpdate(
    item._id,
    { status: "called", calledAt: new Date() },
    { new: true }
  ).lean();
  return updated;
}

module.exports = { enqueuePrescription, getQueueSnapshot, callNext };
