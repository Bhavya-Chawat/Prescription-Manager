const User = require("../models/User.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET || "secret";

async function login({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return null;

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });
  return {
    token,
    user: { id: user._id, username: user.username, role: user.role },
  };
}

async function signup({ username, password, role = "viewer" }) {
  const existing = await User.findOne({ username });
  if (existing) throw new Error("Username already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword, role });

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
    expiresIn: "1d",
  });
  return {
    token,
    user: { id: user._id, username: user.username, role: user.role },
  };
}

module.exports = { login, signup };
