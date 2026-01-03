const mongoose = require('mongoose');

const QueueEntrySchema = new mongoose.Schema(
  {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
    priority: { type: Number, required: true, min: 0, max: 3 },
    status: { type: String, default: 'waiting' }, // waiting | called | skipped | completed
    calledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QueueEntry', QueueEntrySchema);