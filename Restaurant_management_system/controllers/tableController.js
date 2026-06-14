const prisma = require("../config/prisma");

// @route  GET /api/tables
const getTables = async (req, res) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { number: "asc" },
    });

    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/tables
const createTable = async (req, res) => {
  const { number, capacity } = req.body;

  try {
    if (!number || !capacity) {
      return res.status(400).json({ message: "Table number and capacity are required" });
    }

    const existing = await prisma.table.findUnique({ where: { number: parseInt(number) } });
    if (existing) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const table = await prisma.table.create({
      data: {
        number: parseInt(number),
        capacity: parseInt(capacity),
      },
    });

    res.status(201).json({ message: "Table created successfully", table });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/tables/available
const checkAvailability = async (req, res) => {
  try {
    const { guestCount, date } = req.query;

    // Find tables that are physically free (not occupied)
    let tables = await prisma.table.findMany({
      where: {
        status: { not: "occupied" },
        ...(guestCount && { capacity: { gte: parseInt(guestCount) } }),
      },
      orderBy: { capacity: "asc" },
    });

    // If a date is provided, exclude tables with an active reservation on that date
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const reservedTableIds = await prisma.reservation.findMany({
        where: {
          status: "confirmed",
          date: { gte: startOfDay, lte: endOfDay },
        },
        select: { tableId: true },
      });

      const reservedIds = new Set(reservedTableIds.map((r) => r.tableId));
      tables = tables.filter((t) => !reservedIds.has(t.id));
    }

    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/tables/:id/status
const updateTableStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["available", "occupied", "reserved"];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const table = await prisma.table.findUnique({ where: { id: req.params.id } });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const updated = await prisma.table.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(200).json({ message: "Table status updated", table: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTables, createTable, checkAvailability, updateTableStatus };