const mongoose = require('mongoose');
const Discount = require('../models/discountModel');

// ✅ Get only active discounts (not soft-deleted)
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({ isDeleted: { $ne: true } });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounts' });
  }
};

// ✅ Create a new discount
const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create discount', error });
  }
};

// ✅ Soft delete (set isDeleted = true)
const softDeleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Discount.updateOne(
      { _id: id },
      { $set: { isDeleted: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({ message: 'Discount soft-deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error soft-deleting discount' });
  }
};

// ✅ Restore soft-deleted discount (set isDeleted = false)
const restoreDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Discount.updateOne(
      { _id: id },
      { $set: { isDeleted: false } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.status(200).json({ message: 'Discount restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring discount' });
  }
};

// ✅ Update discount
const updateDiscount = async (req, res) => {
  const { id } = req.params;
  console.log('🔥 Update request for ID:', id);
  console.log('📝 Update payload:', req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid discount ID' });
  }

  try {
    const updated = await Discount.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    console.log('✅ Discount updated:', updated);
    res.json(updated);
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(400).json({
      message: 'Failed to update discount',
      error: error.message || 'Validation failed',
    });
  }
};

// ✅ Get deleted discounts (for admin use)
const getDeletedDiscounts = async (req, res) => {
  try {
    const deleted = await Discount.find({ isDeleted: true });
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deleted discounts' });
  }
};

module.exports = {
  getDiscounts,
  createDiscount,
  softDeleteDiscount,
  restoreDiscount,
  updateDiscount,
  getDeletedDiscounts,
};
