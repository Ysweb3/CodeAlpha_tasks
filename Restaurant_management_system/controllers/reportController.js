const prisma = require("../config/prisma");

// @route  GET /api/reports/daily-sales
const getDailySales = async (req, res) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        status: "served",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { items: { include: { menuItem: true } } },
    });

    let totalRevenue = 0;
    const categoryBreakdown = {};

    for (const order of orders) {
      totalRevenue += order.totalAmount;

      for (const item of order.items) {
        const category = item.menuItem.category;
        const lineTotal = item.price * item.quantity;
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + lineTotal;
      }
    }

    res.status(200).json({
      date: startOfDay.toISOString().split("T")[0],
      totalOrders: orders.length,
      totalRevenue,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/reports/stock-alerts
const getStockAlerts = async (req, res) => {
  try {
    const items = await prisma.inventory.findMany();

    const lowStockItems = items.filter((item) => item.quantity <= item.alertLevel);

    res.status(200).json({
      count: lowStockItems.length,
      items: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/reports/top-items
const getTopSellingItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: { menuItem: true, order: true },
      where: {
        order: { status: "served" },
      },
    });

    // Aggregate quantities sold per menu item
    const tally = {};

    for (const item of orderItems) {
      const key = item.menuItemId;
      if (!tally[key]) {
        tally[key] = {
          menuItemId: key,
          name: item.menuItem.name,
          category: item.menuItem.category,
          totalSold: 0,
          totalRevenue: 0,
        };
      }
      tally[key].totalSold += item.quantity;
      tally[key].totalRevenue += item.price * item.quantity;
    }

    const topItems = Object.values(tally)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    res.status(200).json(topItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDailySales, getStockAlerts, getTopSellingItems };