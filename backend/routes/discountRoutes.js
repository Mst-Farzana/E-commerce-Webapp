const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// ✅ Middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

// ✅ Controllers
const {
  getDiscounts,
  createDiscount,
  updateDiscount,
  softDeleteDiscount,
  restoreDiscount,
  getDeletedDiscounts,
} = require('../controllers/discountController');

router.get('/', getDiscounts);

router.get('/deleted', getDeletedDiscounts);

router.post('/', createDiscount);

router.put('/:id', validateObjectId, updateDiscount);

router.delete('/:id', validateObjectId, softDeleteDiscount);

router.patch('/restore/:id', validateObjectId, restoreDiscount);

module.exports = router;
