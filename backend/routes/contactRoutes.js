const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact/
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: 'New Contact Message',
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
