const prisma = require("../config/prisma");

// Helper: auto-deduct inventory based on menu item name matching inventory name
const deductInventory = async (menuItemName, quantityOrdered) => {
  try {
    const inventoryItem = await prisma.inventory.findUnique({
      where: { name: menuItemName },
    });

    if (inventoryItem) {
      await prisma.inventory.update({
        where: { id: inventoryItem.id },
        data: { quantity: { decrement: quantityOrdered } },
      });
    }
    // If no matching inventory item, silently skip (not all menu items track stock)
  } catch (error) {
    console.error("Inventory deduction error:", error.message);
  }
};

// @route  POST /api/orders
const placeOrder = async (req, res) => {
  const { tableId, items } = req.body; // items = [{ menuItemId, quantity }]

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item" });
    }

    // Fetch all menu items being ordered
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (menuItems.length !== menuItemIds.length) {
      return res.status(404).json({ message: "One or more menu items not found" });
    }

    // Check availability
    const unavailable = menuItems.filter((m) => !m.available);
    if (unavailable.length > 0) {
      return res.status(400).json({
        message: "Some items are unavailable",
        items: unavailable.map((m) => m.name),
      });
    }

    // Build order items with price snapshot + calculate total
    let totalAmount = 0;
    const orderItemsData = items.map((orderItem) => {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId);
      const lineTotal = menuItem.price * orderItem.quantity;
      totalAmount += lineTotal;

      return {
        menuItemId: menuItem.id,
        quantity: orderItem.quantity,
        price: menuItem.price,
      };
    });

    // Validate table if provided
    if (tableId) {
      const table = await prisma.table.findUnique({ where: { id: tableId } });
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
    }

    // Create order with nested order items
    const order = await prisma.order.create({
      data: {
        ...(tableId && { tableId }),
        staffId: req.user.id,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { menuItem: true } },
        table: true,
      },
    });

    // Mark table as occupied
    if (tableId) {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: "occupied" },
      });
    }

    // Auto-deduct inventory for each item ordered
    for (const orderItem of items) {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId);
      await deductInventory(menuItem.name, orderItem.quantity);
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const orders = await prisma.order.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        staff: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        staff: { select: { id: true, name: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "preparing", "served", "cancelled"];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: { include: { menuItem: true } }, table: true },
    });

    // Free up the table once order is served or cancelled
    if ((status === "served" || status === "cancelled") && order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: "available" },
      });
    }

    res.status(200).json({ message: "Order status updated", order: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PATCH /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: "cancelled" },
    });

    if (order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: "available" },
      });
    }

    res.status(200).json({ message: "Order cancelled successfully", order: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder };