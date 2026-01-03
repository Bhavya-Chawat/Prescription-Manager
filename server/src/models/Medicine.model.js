const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    genericName: { type: String },
    category: { type: String },
    unit: { type: String },
    unitPrice: { type: Number, default: 0 },
    reorderThreshold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', MedicineSchema);