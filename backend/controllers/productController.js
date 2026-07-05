const mongoose = require('mongoose');
const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: 'i' };
  }

  const sortField = req.query.sortField || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  try {
    const products = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

module.exports = { getAllProducts };
