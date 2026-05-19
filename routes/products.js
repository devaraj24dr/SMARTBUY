const router = require('express').Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category && category !== 'All') where.category = category;
    if (search) where.name = { contains: search };
    const products = await prisma.product.findMany({ where, orderBy: { name: 'asc' } });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/barcode/:code', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { barcode: req.params.code } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, nameTa, price, category, barcode, stock, emoji } = req.body;
    const p = await prisma.product.create({
      data: { name, nameTa: nameTa || '', price: parseFloat(price), category, barcode, stock: parseInt(stock) || 100, emoji: emoji || '📦' }
    });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, nameTa, price, category, barcode, stock, emoji } = req.body;
    const p = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, nameTa, price: parseFloat(price), category, barcode, stock: parseInt(stock), emoji }
    });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
