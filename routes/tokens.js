const router = require('express').Router();
const prisma = require('../lib/prisma');

// GET /api/tokens/next
router.get('/next', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const last = await prisma.token.findFirst({
      where: { date: today },
      orderBy: { number: 'desc' }
    });
    const next = last ? last.number + 1 : 1;
    const token = await prisma.token.create({ data: { number: next, date: today } });
    res.json({ token: next, id: token.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/tokens/today
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tokens = await prisma.token.findMany({ where: { date: today }, orderBy: { number: 'asc' } });
    res.json(tokens);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
