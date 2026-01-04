const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { auth } = require("../middleware/auth.middleware");
const { getDashboardStats } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/stats", auth, asyncHandler(getDashboardStats));

module.exports = router;
