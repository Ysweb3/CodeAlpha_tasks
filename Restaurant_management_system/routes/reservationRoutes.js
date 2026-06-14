const express = require("express");
const router = express.Router();
const {
  makeReservation,
  getReservations,
  cancelReservation,
} = require("../controllers/reservationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, makeReservation);
router.get("/", protect, authorize("admin", "manager"), getReservations);
router.patch("/:id/cancel", protect, authorize("admin", "manager", "staff"), cancelReservation);

module.exports = router;