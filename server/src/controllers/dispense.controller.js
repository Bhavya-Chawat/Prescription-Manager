const { ok } = require("../utils/ApiResponse");
const { processDispense } = require("../services/dispense.service");
const Dispense = require("../models/Dispense.model");
const Bill = require("../models/Bill.model");

async function processDispenseController(req, res) {
  try {
    const { prescriptionId } = req.params;
    const record = await processDispense(prescriptionId);
    return res.status(201).json(ok(record, "Dispense processed"));
  } catch (error) {
    console.error("Error processing dispense:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process dispense",
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
}

async function getAllDispensesController(req, res) {
  try {
    const dispenses = await Dispense.find()
      .populate({
        path: "prescriptionId",
        populate: [
          { path: "patientId", select: "name age gender" },
          { path: "items.medicineId", select: "name unitPrice" },
        ],
      })
      .populate("allocations.batchId", "batchCode expiryDate")
      .sort({ createdAt: -1 })
      .lean();

    // Filter out dispenses with null/deleted prescriptions and fetch bills
    const validDispenses = dispenses.filter((d) => d.prescriptionId);

    const dispensesWithBills = await Promise.all(
      validDispenses.map(async (dispense) => {
        try {
          const bill = await Bill.findOne({ dispenseId: dispense._id }).lean();
          return { ...dispense, bill };
        } catch (billError) {
          console.error(
            `Error fetching bill for dispense ${dispense._id}:`,
            billError
          );
          return { ...dispense, bill: null };
        }
      })
    );

    return res.json(ok(dispensesWithBills, "Dispenses fetched"));
  } catch (error) {
    console.error("Error fetching dispenses:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dispenses",
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
}

async function getAllBillsController(req, res) {
  try {
    const bills = await Bill.find()
      .populate({
        path: "dispenseId",
        populate: {
          path: "prescriptionId",
          populate: { path: "patientId", select: "name" },
        },
      })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(ok(bills, "Bills fetched"));
  } catch (error) {
    console.error("Error fetching bills:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bills",
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
}

module.exports = {
  processDispenseController,
  getAllDispensesController,
  getAllBillsController,
};
