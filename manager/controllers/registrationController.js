const prisma = require("../config/prisma");

// @route  POST /api/registrations/:eventId
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Event has already passed" });
    }

    // Count active registrations
    const registrationCount = await prisma.registration.count({
      where: { eventId, status: "active" },
    });

    // Check if event is full
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if user already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: { userId: req.user.id, eventId, status: "active" },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: req.user.id,
        eventId,
      },
      include: {
        event: {
          select: { title: true, date: true, location: true },
        },
      },
    });

    res.status(201).json({
      message: "Successfully registered for event",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/registrations/my
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        userId: req.user.id,
        status: "active",
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            date: true,
            capacity: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    res.status(200).json({
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PATCH /api/registrations/:id/cancel
const cancelRegistration = async (req, res) => {
  try {
    // Find registration
    const registration = await prisma.registration.findUnique({
      where: { id: req.params.id },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Make sure it belongs to the logged in user
    if (registration.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this registration" });
    }

    // Check if already cancelled
    if (registration.status === "cancelled") {
      return res.status(400).json({ message: "Registration is already cancelled" });
    }

    // Cancel it
    const updated = await prisma.registration.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
      include: {
        event: {
          select: { title: true, date: true },
        },
      },
    });

    res.status(200).json({
      message: "Registration cancelled successfully",
      registration: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration };