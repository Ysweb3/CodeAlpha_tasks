const prisma = require("../config/prisma");

// @route  POST /api/reservations
const makeReservation = async (req, res) => {
  const { tableId, guestCount, date } = req.body;

  try {
    if (!tableId || !guestCount || !date) {
      return res.status(400).json({ message: "tableId, guestCount and date are required" });
    }

    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (parseInt(guestCount) > table.capacity) {
      return res.status(400).json({ message: "Guest count exceeds table capacity" });
    }

    // Check for conflicting reservation on the same table & date
    const reservationDate = new Date(date);
    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await prisma.reservation.findFirst({
      where: {
        tableId,
        status: "confirmed",
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (conflict) {
      return res.status(400).json({ message: "Table already reserved for this date" });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: req.user.id,
        tableId,
        guestCount: parseInt(guestCount),
        date: reservationDate,
      },
      include: { table: true },
    });

    // Mark table as reserved
    await prisma.table.update({
      where: { id: tableId },
      data: { status: "reserved" },
    });

    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/reservations
const getReservations = async (req, res) => {
  try {
    const { status } = req.query;

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        table: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PATCH /api/reservations/:id/cancel
const cancelReservation = async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: req.params.id } });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Reservation already cancelled" });
    }

    const updated = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
    });

    // Free up the table
    await prisma.table.update({
      where: { id: reservation.tableId },
      data: { status: "available" },
    });

    res.status(200).json({ message: "Reservation cancelled successfully", reservation: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { makeReservation, getReservations, cancelReservation };