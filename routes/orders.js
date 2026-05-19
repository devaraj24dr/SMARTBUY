const router = require('express').Router();
const prisma = require('../lib/prisma');

// POST /api/orders — Place new order
router.post('/', async (req, res) => {
  try {
    const { type, tableNumber, items, total, paymentMethod, restaurantId } = req.body;

    // Generate token
    const today = new Date().toISOString().split('T')[0];
    const last = await prisma.token.findFirst({ where: { date: today }, orderBy: { number: 'desc' } });
    const tokenNumber = last ? last.number + 1 : 1;
    await prisma.token.create({ data: { number: tokenNumber, date: today } });

    // Create order
    const order = await prisma.order.create({
      data: {
        tokenNumber,
        type: type || 'restaurant',
        tableNumber: tableNumber ? parseInt(tableNumber) : null,
        total: parseFloat(total),
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        restaurantId: restaurantId ? parseInt(restaurantId) : null,
        items: {
          create: items.map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            menuItemId: item.menuItemId ? parseInt(item.menuItemId) : null,
            productId: item.productId ? parseInt(item.productId) : null,
          }))
        }
      },
      include: { items: true }
    });

    // Emit to kitchen
    req.io.to('kitchen').emit('new_order', order);

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders/live — All active orders (KDS)
router.get('/live', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ['received', 'preparing'] } },
      include: { items: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/orders/:id/status — Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: { items: true }
    });

    // Emit status update to customer's order room
    req.io.to(`order_${order.id}`).emit('order_status_update', { orderId: order.id, status, tokenNumber: order.tokenNumber });

    // If ready, emit to token display screen
    if (status === 'ready') {
      req.io.to('token_display').emit('token_called', { tokenNumber: order.tokenNumber, orderId: order.id });
    }

    // Also update kitchen view
    req.io.to('kitchen').emit('order_updated', order);

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders — History with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
