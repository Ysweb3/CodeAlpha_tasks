const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.post("/:eventId", protect, registerForEvent);
router.get("/my", protect, getMyRegistrations);
router.patch("/:id/cancel", protect, cancelRegistration);

module.exports = router;