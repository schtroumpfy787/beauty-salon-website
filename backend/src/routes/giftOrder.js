const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/pool');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Rate limit: 3 orders per minute
router.post(
  '/',
  rateLimiter(3, 60000),
  [
    body('amount').isFloat({ min: 1 }).withMessage('Le montant doit être positif'),
    body('servicesSelected').optional().escape(),
    body('customerName').optional().trim().escape(),
    body('customerEmail').optional().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, servicesSelected, customerName, customerEmail } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO gift_orders (amount, services_selected, customer_name, customer_email, status)
         VALUES ($1, $2, $3, $4, 'pending')
         RETURNING id, status`,
        [amount, servicesSelected || null, customerName || null, customerEmail || null]
      );

      return res.status(201).json({
        message: 'Votre commande a été enregistrée. Vous serez recontactée par email pour finaliser le paiement.',
        orderId: result.rows[0].id,
        status: result.rows[0].status,
      });
    } catch (err) {
      console.error('Gift order error:', err);
      return res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
    }
  }
);

module.exports = router;
