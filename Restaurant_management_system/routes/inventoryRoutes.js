const express = require("express");
const router = express.Router();
const {
  getInventory,
  addInventoryItem,
  updateInventory,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "manager"), getInventory);
router.post("/", protect, authorize("admin"), addInventoryItem);
router.put("/:id", protect, authorize("admin", "manager"), updateInventory);
router.delete("/:id", protect, authorize("admin"), deleteInventoryItem);

module.exports = router;