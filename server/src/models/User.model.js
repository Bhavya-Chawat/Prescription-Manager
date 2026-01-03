const mongoose = require("mongoose");
const { ROLES } = require("../config/constants");

const UserSchema = new mongoose.Schema(
  {
    employeeId: { type: String },
    name: { type: String },
    email: { type: String },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.VIEWER },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
