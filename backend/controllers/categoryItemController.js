const mongoose = require('mongoose');
const CategoryItem = require('../models/CategoryItem');

exports.getAllItems = async (req, res) => {
  try {
    const items = await CategoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItemsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const items = await CategoryItem.find({ category });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createItemWithUrl = async (req, res) => {
  const { category, name, details, img, price } = req.body;
  if (!category || !name || !details || !img || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ auto format local image path
  let finalImg = img;
  if (!img.startsWith('http') && !img.startsWith('/uploads/')) {
    finalImg = `/uploads/${img}`;
  }

  try {
    const newItem = new CategoryItem({
      category,
      name,
      details,
      img: finalImg,
      price,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const validCategories = [
  'Dress',
  'Cosmetics',
  'Jewelry',
  'Bag',
  'Watch',
  'Phone',
  'Kids Item',
  'Shoe',
];

exports.updateItem = async (req, res) => {
  const id = req.params.id;
  const { category, name, details, img, price } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }

  if (!category || !name || !details || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const updateData = { category, name, details, price };

  if (img) {
    if (!img.startsWith('http') && !img.startsWith('/uploads/')) {
      updateData.img = `/uploads/${img}`;
    } else {
      updateData.img = img;
    }
  }

  try {
    const updatedItem = await CategoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedItem)
      return res.status(404).json({ message: 'Item not found' });

    res.json(updatedItem);
  } catch (err) {
    console.error('Update Item Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
