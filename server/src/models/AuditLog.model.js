const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // CREATE / UPDATE / DELETE / DISPENSE / BILL / QUEUE
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);