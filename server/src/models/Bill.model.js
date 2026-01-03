const mongoose = require('mongoose');

const BillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const BillSchema = new mongoose.Schema(
  {
    dispenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispense', required: true },
    items: [BillItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, default: 'unpaid' }, // unpaid | paid | waived
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', BillSchema);