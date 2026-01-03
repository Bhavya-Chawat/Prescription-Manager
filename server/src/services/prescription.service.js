const Prescription = require("../models/Prescription.model.js");
const { LinkedList } = require("../dsa/LinkedList");

const Patient = require("../models/Patient.model.js");

async function createPrescription({
  patientId,
  patientName,
  doctor,
  department,
  items,
}) {
  // If patientId is not provided, try to find or create by name
  if (!patientId && patientName) {
    let patient = await Patient.findOne({ name: patientName });
    if (!patient) {
      patient = await Patient.create({
        name: patientName,
        age: 30,
        gender: "Unknown",
      }); // Default values
    }
    patientId = patient._id;
  }

  // items: [{ medicineId, dosage, quantity }]
  const list = new LinkedList();
  items.forEach((it) =>
    list.append({
      medicineId: it.medicineId,
      dosage: it.dosage,
      quantity: it.quantity,
    })
  );
  // Convert linked list to array while preserving order
  const arr = list.toArray();
  // Create subdocs and wire nextItemId pointers
  const doc = new Prescription({ patientId, doctor, department, items: arr });
  // Mongoose assigns _id to subdocs immediately
  for (let i = 0; i < doc.items.length; i++) {
    const cur = doc.items[i];
    const next = doc.items[i + 1];
    cur.nextItemId = next ? next._id : undefined;
  }
  doc.itemsHead = doc.items[0]?._id || null;
  await doc.save();
  return doc;
}

async function getPrescription(id) {
  return Prescription.findById(id).lean();
}

async function getAllPrescriptions() {
  return Prescription.find()
    .populate("patientId", "name age gender")
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = { createPrescription, getPrescription, getAllPrescriptions };
