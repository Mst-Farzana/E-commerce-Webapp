const express = require('express');
const router = express.Router();

const { sendMail } = require('../controllers/mailController'); // make sure path is correct

router.post('/send-email', sendMail);

module.exports = router;
