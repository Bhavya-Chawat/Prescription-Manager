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

  // Populate the entry before returning
  const populatedEntry = await QueueEntry.findById(entry._id)
    .populate({
      path: "prescriptionId",
      populate: {
        path: "patientId",
        select: "name age gender",
      },
    })
    .lean();

  return populatedEntry;
}

async function getQueueSnapshot() {
  const waiting = await QueueEntry.find({ status: "waiting" })
    .populate({
      path: "prescriptionId",
      match: { status: { $ne: "dispensed" } }, // Exclude already dispensed prescriptions
      populate: {
        path: "patientId",
        select: "name age gender",
      },
    })
    .sort({ priority: 1, enqueuedAt: 1 })
    .lean();

  // Filter out entries where prescription was not found (dispensed or deleted)
  const validEntries = waiting.filter((e) => e.prescriptionId);

  const pq = new PriorityQueue(4);
  validEntries.forEach((e) => pq.push(e.priority, e));
  return pq.snapshot();
}

async function callNext() {
  const waiting = await QueueEntry.find({ status: "waiting" })
    .populate({
      path: "prescriptionId",
      match: { status: { $ne: "dispensed" } }, // Exclude already dispensed prescriptions
      populate: {
        path: "patientId",
        select: "name age gender",
      },
    })
    .sort({ priority: 1, enqueuedAt: 1 })
    .lean();

  // Filter out entries where prescription was not found (dispensed or deleted)
  const validEntries = waiting.filter((e) => e.prescriptionId);

  const pq = new PriorityQueue(4);
  validEntries.forEach((e) => pq.push(e.priority, e));
  const res = pq.popNext();
  if (!res) return null;
  const { item } = res;
  const updated = await QueueEntry.findByIdAndUpdate(
    item._id,
    { status: "called", calledAt: new Date() },
    { new: true }
  )
    .populate({
      path: "prescriptionId",
      populate: {
        path: "patientId",
        select: "name age gender",
      },
    })
    .lean();
  return updated;
}

module.exports = { enqueuePrescription, getQueueSnapshot, callNext };
