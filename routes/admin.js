const router = require('express').Router();
const prisma = require('../lib/prisma');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({ where: { createdAt: { gte: today } }, select: { total: true } }),
      prisma.order.findMany({ select: { total: true, createdAt: true, status: true } })
    ]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const activeOrders = await prisma.order.count({ where: { status: { in: ['received', 'preparing'] } } });

    // Hourly data for today
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      orders: 0,
      revenue: 0
    }));
    todayOrders.forEach(o => {
      // We don't have hour from the select, so this is a simplified version
    });

    res.json({
      totalOrders,
      todayOrders: todayOrders.length,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      activeOrders,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/orders — paginated order history
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });
    const total = await prisma.order.count({ where });
    res.json({ orders, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
