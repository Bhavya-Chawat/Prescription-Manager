const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // prescription item id
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const DispenseSchema = new mongoose.Schema(
  {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
    allocations: [AllocationSchema], // FEFO-based allocations
    status: { type: String, default: 'partial' }, // partial | full
    backorders: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        remainingQty: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispense', DispenseSchema);