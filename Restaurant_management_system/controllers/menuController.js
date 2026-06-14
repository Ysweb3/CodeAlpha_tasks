const prisma = require("../config/prisma");

// @route  GET /api/menu
const getMenu = async (req, res) => {
  try {
    const { category } = req.query;

    const items = await prisma.menuItem.findMany({
      where: {
        available: true,
        ...(category && { category }),
      },
      orderBy: { category: "asc" },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/menu/:id
const getMenuItemById = async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/menu
const createMenuItem = async (req, res) => {
  const { name, description, price, category } = req.body;

  try {
    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: "Name, price and category are required" });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
      },
    });

    res.status(201).json({ message: "Menu item created successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  const { name, description, price, category, available } = req.body;

  try {
    const item = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const updated = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(available !== undefined && { available }),
      },
    });

    res.status(200).json({ message: "Menu item updated successfully", item: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await prisma.menuItem.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMenu, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };