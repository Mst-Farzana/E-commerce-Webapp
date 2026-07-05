const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Controller function
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Define route for GET /api/products
router.get('/', getAllProducts);

module.exports = router;
