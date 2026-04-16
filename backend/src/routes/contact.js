const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/pool');
const nodemailer = require('nodemailer');
const config = require('../config');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Rate limit: 5 submissions per minute
router.post(
  '/',
  rateLimiter(5, 60000),
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
    body('email').isEmail().withMessage('Adresse email invalide').normalizeEmail(),
    body('phone').trim().matches(/^\d{10}$/).withMessage('Le numéro de téléphone doit contenir 10 chiffres'),
    body('contactMotive').trim().notEmpty().withMessage('Le motif est requis').escape(),
    body('message').trim().notEmpty().withMessage('Le message est requis').escape(),
    body('services').optional().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, contactMotive, services, message } = req.body;

    try {
      // Store in database
      await db.query(
        `INSERT INTO contact_submissions (name, email, phone, contact_motive, services, message)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, email, phone, contactMotive, services || null, message]
      );

      // Send email notification
      if (config.smtp.host && config.smtp.user && config.salonEmail) {
        try {
          const transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.port === 465,
            auth: {
              user: config.smtp.user,
              pass: config.smtp.pass,
            },
          });

          await transporter.sendMail({
            from: `"Institut For You - Site Web" <${config.smtp.user}>`,
            to: config.salonEmail,
            subject: `Nouveau message de contact - ${contactMotive}`,
            text: `Nouveau message de ${name} (${email}, ${phone}):\n\nMotif: ${contactMotive}\nServices: ${services || 'N/A'}\n\nMessage:\n${message}`,
          });
        } catch (emailErr) {
          console.error('Email delivery failed:', emailErr.message);
          // Don't fail the request if email fails - submission is saved in DB
        }
      }

      return res.status(201).json({ message: 'Votre message a bien été envoyé. Merci !' });
    } catch (err) {
      console.error('Contact submission error:', err);
      return res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer.' });
    }
  }
);

module.exports = router;
