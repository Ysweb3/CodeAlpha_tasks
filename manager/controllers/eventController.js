const prisma = require("../config/prisma");

// @route  GET /api/events
const getAllEvents = async (req, res) => {
  try {
    const { search, location } = req.query;

    const events = await prisma.event.findMany({
      where: {
        date: { gte: new Date() }, // only upcoming events
        ...(search && { title: { contains: search, mode: "insensitive" } }),
        ...(location && { location: { contains: location, mode: "insensitive" } }),
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Count active registrations
    const registrationCount = await prisma.registration.count({
      where: { eventId: event.id, status: "active" },
    });

    res.status(200).json({
      ...event,
      spotsLeft: event.capacity - registrationCount,
      registrationCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/events
const createEvent = async (req, res) => {
  const { title, description, location, date, capacity } = req.body;

  try {
    if (!title || !date || !capacity) {
      return res.status(400).json({ message: "Title, date and capacity are required" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        capacity: parseInt(capacity),
        createdById: req.user.id,
      },
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/events/:id
const updateEvent = async (req, res) => {
  const { title, description, location, date, capacity } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location && { location }),
        ...(date && { date: new Date(date) }),
        ...(capacity && { capacity: parseInt(capacity) }),
      },
    });

    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all related registrations first
    await prisma.registration.deleteMany({
      where: { eventId: req.params.id },
    });

    await prisma.event.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };