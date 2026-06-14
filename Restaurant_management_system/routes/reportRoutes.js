const express = require("express");
const router = express.Router();
const {
  getDailySales,
  getStockAlerts,
  getTopSellingItems,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/daily-sales", protect, authorize("admin", "manager"), getDailySales);
router.get("/stock-alerts", protect, authorize("admin", "manager"), getStockAlerts);
router.get("/top-items", protect, authorize("admin", "manager"), getTopSellingItems);

module.exports = router;