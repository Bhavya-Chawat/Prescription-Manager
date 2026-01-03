const { ok } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { login, signup } = require("../services/auth.service");

async function loginController(req, res, next) {
  const { username, password } = req.body;
  const result = await login({ username, password });
  if (!result) return next(new ApiError(401, "Invalid credentials"));
  return res.json(ok(result, "Login successful"));
}

async function signupController(req, res, next) {
  try {
    const { username, password, role } = req.body;
    const result = await signup({ username, password, role });
    return res.json(ok("Signup successful", result));
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
}

module.exports = { loginController, signupController };
