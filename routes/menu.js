const router = require('express').Router();
const prisma = require('../lib/prisma');

// GET /api/menu?restaurant=a2b
router.get('/', async (req, res) => {
  try {
    const { restaurant = 'a2b', category } = req.query;
    const rest = await prisma.restaurant.findUnique({ where: { slug: restaurant } });
    if (!rest) return res.status(404).json({ error: 'Restaurant not found' });
    const where = { restaurantId: rest.id };
    if (category && category !== 'All') where.category = category;
    const items = await prisma.menuItem.findMany({ where, orderBy: { category: 'asc' } });
    res.json({ restaurant: rest, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/menu/items
router.post('/items', async (req, res) => {
  try {
    const { name, nameTa, description, price, category, emoji, restaurantId, available } = req.body;
    const item = await prisma.menuItem.create({
      data: { name, nameTa: nameTa || '', description: description || '', price: parseFloat(price), category, emoji: emoji || '🍽️', restaurantId: parseInt(restaurantId), available: available !== false }
    });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/menu/items/:id
router.put('/items/:id', async (req, res) => {
  try {
    const { name, nameTa, description, price, category, emoji, available } = req.body;
    const item = await prisma.menuItem.update({
      where: { id: parseInt(req.params.id) },
      data: { name, nameTa, description, price: parseFloat(price), category, emoji, available }
    });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/menu/items/:id
router.delete('/items/:id', async (req, res) => {
  try {
    await prisma.menuItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
