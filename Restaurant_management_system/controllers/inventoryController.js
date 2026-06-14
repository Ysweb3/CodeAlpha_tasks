const prisma = require("../config/prisma");

// @route  GET /api/inventory
const getInventory = async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      orderBy: { name: "asc" },
    });

    // Flag low-stock items
    const withAlerts = items.map((item) => ({
      ...item,
      lowStock: item.quantity <= item.alertLevel,
    }));

    res.status(200).json(withAlerts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/inventory
const addInventoryItem = async (req, res) => {
  const { name, quantity, unit, alertLevel } = req.body;

  try {
    if (!name || quantity === undefined || !unit || alertLevel === undefined) {
      return res.status(400).json({ message: "name, quantity, unit and alertLevel are required" });
    }

    const existing = await prisma.inventory.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "Inventory item already exists" });
    }

    const item = await prisma.inventory.create({
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        alertLevel: parseFloat(alertLevel),
      },
    });

    res.status(201).json({ message: "Inventory item added successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/inventory/:id
const updateInventory = async (req, res) => {
  const { quantity, alertLevel, unit, name } = req.body;

  try {
    const item = await prisma.inventory.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const updated = await prisma.inventory.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(unit && { unit }),
        ...(alertLevel !== undefined && { alertLevel: parseFloat(alertLevel) }),
      },
    });

    res.status(200).json({ message: "Inventory updated successfully", item: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  DELETE /api/inventory/:id
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await prisma.inventory.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    await prisma.inventory.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getInventory, addInventoryItem, updateInventory, deleteInventoryItem };  