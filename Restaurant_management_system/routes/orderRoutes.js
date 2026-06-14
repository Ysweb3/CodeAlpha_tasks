const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin", "manager", "staff"), placeOrder);
router.get("/", protect, authorize("admin", "manager"), getOrders);
router.get("/:id", protect, authorize("admin", "manager", "staff"), getOrderById);
router.patch("/:id/status", protect, authorize("admin", "manager", "staff"), updateOrderStatus);
router.patch("/:id/cancel", protect, authorize("admin", "manager", "staff"), cancelOrder);

module.exports = router;