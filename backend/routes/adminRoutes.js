const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { registerAdmin, loginAdmin, getDashboardData } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', asyncHandler(registerAdmin));
router.post('/login', asyncHandler(loginAdmin));
router.get('/dashboard-data', asyncHandler(getDashboardData));

module.exports = router;
