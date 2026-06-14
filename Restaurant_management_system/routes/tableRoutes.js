const express = require("express");
const router = express.Router();
const {
  getTables,
  createTable,
  checkAvailability,
  updateTableStatus,
} = require("../controllers/tableController");
const { protect, authorize } = require("../middleware/authMiddleware");

// IMPORTANT: /available must come before /:id-style routes if you add any later
router.get("/available", checkAvailability);
router.get("/", protect, authorize("admin", "manager", "staff"), getTables);
router.post("/", protect, authorize("admin"), createTable);
router.put("/:id/status", protect, authorize("admin", "manager", "staff"), updateTableStatus);

module.exports = router;