const mongoose = require('mongoose');

// Linked list representation for prescription items
const PrescriptionItemSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    dosage: { type: String },
    quantity: { type: Number, required: true },
    nextItemId: { type: mongoose.Schema.Types.ObjectId }, // LinkedList next pointer
  },
  { _id: true }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: String, required: true },
    department: { type: String },
    itemsHead: { type: mongoose.Schema.Types.ObjectId }, // head of linked list
    items: [PrescriptionItemSchema],
    status: { type: String, default: 'draft' }, // draft | queued | dispensed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', PrescriptionSchema);