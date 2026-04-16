const express = require('express');
const db = require('../db/pool');

const router = express.Router();

// GET /api/services - Get all active services
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, img, alt, "group", value, name, price, duration, path FROM services WHERE is_active = true ORDER BY id'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch services:', err);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/:id - Get a single service
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, img, alt, "group", value, name, price, duration, path FROM services WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to fetch service:', err);
    return res.status(500).json({ error: 'Failed to fetch service' });
  }
});

module.exports = router;
