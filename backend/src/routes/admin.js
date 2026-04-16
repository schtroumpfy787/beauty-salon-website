const express = require('express');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/pool');
const requireAuth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/admin/login
router.post(
  '/login',
  rateLimiter(3, 60000),
  [
    body('username').trim().notEmpty().escape(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const result = await db.query('SELECT * FROM admin_users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }

      req.session.adminId = user.id;
      req.session.adminUsername = user.username;

      return res.json({ message: 'Connexion réussie', username: user.username });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Déconnexion réussie' });
  });
});

// GET /api/admin/me - Check authentication status
router.get('/me', requireAuth, (req, res) => {
  return res.json({ username: req.session.adminUsername });
});

// ===== SERVICES CRUD =====

// GET /api/admin/services - List all services (including inactive)
router.get('/services', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY id');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch services error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/services - Create a new service
router.post(
  '/services',
  requireAuth,
  [
    body('group').trim().notEmpty().escape(),
    body('value').trim().notEmpty().escape(),
    body('name').trim().notEmpty().escape(),
    body('price').isFloat({ min: 0 }),
    body('duration').isInt({ min: 1 }),
    body('path').optional().trim(),
    body('img').optional().trim(),
    body('alt').optional().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { group, value, name, price, duration, path, img, alt } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO services (img, alt, "group", value, name, price, duration, path)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [img || 'https://placehold.co/400', alt || 'placeholder image', group, value, name, price, duration, path || '/']
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Un service avec cette valeur existe déjà' });
      }
      console.error('Admin create service error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// PUT /api/admin/services/:id - Update a service
router.put(
  '/services/:id',
  requireAuth,
  [
    param('id').isInt(),
    body('name').optional().trim().notEmpty().escape(),
    body('price').optional().isFloat({ min: 0 }),
    body('duration').optional().isInt({ min: 1 }),
    body('group').optional().trim().escape(),
    body('path').optional().trim(),
    body('img').optional().trim(),
    body('alt').optional().trim().escape(),
    body('is_active').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const fields = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'price', 'duration', 'group', 'path', 'img', 'alt', 'is_active'];
    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        const col = field === 'group' ? '"group"' : field;
        updates.push(`${col} = $${paramCount}`);
        values.push(fields[field]);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    try {
      const result = await db.query(
        `UPDATE services SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service non trouvé' });
      }
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Admin update service error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// DELETE /api/admin/services/:id - Delete a service
router.delete('/services/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    return res.json({ message: 'Service supprimé' });
  } catch (err) {
    console.error('Admin delete service error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== SITE CONTENT CRUD =====

// GET /api/admin/content - List all site content
router.get('/content', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM site_content ORDER BY key');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch content error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/content/:key - Update site content
router.put(
  '/content/:key',
  requireAuth,
  [
    body('value').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await db.query(
        `UPDATE site_content SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *`,
        [req.body.value, req.params.key]
      );
      if (result.rows.length === 0) {
        // Create if not exists
        const insertResult = await db.query(
          `INSERT INTO site_content (key, value) VALUES ($1, $2) RETURNING *`,
          [req.params.key, req.body.value]
        );
        return res.json(insertResult.rows[0]);
      }
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Admin update content error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// ===== FAQ CRUD =====

// GET /api/admin/faq - List all FAQ
router.get('/faq', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM faq ORDER BY display_order');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch FAQ error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/faq - Create FAQ entry
router.post(
  '/faq',
  requireAuth,
  [
    body('question').trim().notEmpty().isLength({ max: 500 }),
    body('answer').trim().notEmpty().isLength({ max: 5000 }),
    body('display_order').optional().isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await db.query(
        `INSERT INTO faq (question, answer, display_order) VALUES ($1, $2, $3) RETURNING *`,
        [req.body.question, req.body.answer, req.body.display_order || 0]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Admin create FAQ error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// PUT /api/admin/faq/:id - Update FAQ entry
router.put(
  '/faq/:id',
  requireAuth,
  [
    param('id').isInt(),
    body('question').optional().trim().notEmpty(),
    body('answer').optional().trim().notEmpty(),
    body('display_order').optional().isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, answer, display_order } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (question !== undefined) { updates.push(`question = $${paramCount++}`); values.push(question); }
    if (answer !== undefined) { updates.push(`answer = $${paramCount++}`); values.push(answer); }
    if (display_order !== undefined) { updates.push(`display_order = $${paramCount++}`); values.push(display_order); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id);

    try {
      const result = await db.query(
        `UPDATE faq SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'FAQ non trouvée' });
      }
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Admin update FAQ error:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// DELETE /api/admin/faq/:id
router.delete('/faq/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM faq WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'FAQ non trouvée' });
    }
    return res.json({ message: 'FAQ supprimée' });
  } catch (err) {
    console.error('Admin delete FAQ error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== CONTACT SUBMISSIONS =====

// GET /api/admin/contacts - List contact submissions
router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_submissions ORDER BY submitted_at DESC LIMIT 100');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch contacts error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===== GIFT ORDERS =====

// GET /api/admin/gift-orders - List gift orders
router.get('/gift-orders', requireAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gift_orders ORDER BY created_at DESC LIMIT 100');
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch gift orders error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
