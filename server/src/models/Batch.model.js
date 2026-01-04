const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    batchNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    receivedDate: { type: Date, default: Date.now },
    costPrice: { type: Number, default: 0 },
    isExpired: { type: Boolean, default: false },
  },
  { timestamps: true }
);
BatchSchema.index({ medicineId: 1, batchNumber: 1 }, { unique: true });

module.exports = mongoose.model("Batch", BatchSchema);
