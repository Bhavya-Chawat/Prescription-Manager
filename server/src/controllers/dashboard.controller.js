const Batch = require("../models/Batch.model.js");
const Medicine = require("../models/Medicine.model.js");
const QueueEntry = require("../models/QueueEntry.model.js");
const Bill = require("../models/Bill.model.js");
const { ok } = require("../utils/ApiResponse");

async function getDashboardStats(req, res) {
  try {
    const batches = await Batch.find({});
    const totalStock = batches.reduce((sum, batch) => sum + batch.quantity, 0);

    const medicines = await Medicine.find({});
    let lowStock = 0;
    let criticalStock = 0;

    for (const med of medicines) {
      const totalQty = await Batch.aggregate([
        { $match: { medicineId: med._id } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const qty = totalQty[0]?.total || 0;
      const threshold = med.reorderThreshold || 50;
      const criticalThreshold = threshold * 0.3;

      if (qty === 0 || qty < criticalThreshold) {
        criticalStock++;
      } else if (qty >= criticalThreshold && qty < threshold) {
        lowStock++;
      }
    }

    const inQueue = await QueueEntry.countDocuments({ status: "waiting" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayBills = await Bill.find({
      createdAt: { $gte: startOfDay },
      status: "paid",
    });

    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.total, 0);
    const todayBillCount = todayBills.length;

    const queueBreakdown = await QueueEntry.aggregate([
      { $match: { status: "waiting" } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const queuePriorities = {
      0: queueBreakdown.find((q) => q._id === 0)?.count || 0,
      1: queueBreakdown.find((q) => q._id === 1)?.count || 0,
      2: queueBreakdown.find((q) => q._id === 2)?.count || 0,
      3: queueBreakdown.find((q) => q._id === 3)?.count || 0,
    };

    res.json(
      ok(
        {
          totalStock,
          lowStock,
          criticalStock,
          inQueue,
          todayRevenue,
          todayBillCount,
          queuePriorities,
          stockDetails: {
            critical: criticalStock,
            low: lowStock,
            healthy: medicines.length - criticalStock - lowStock,
          },
        },
        "Dashboard stats retrieved"
      )
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getDashboardStats,
};
