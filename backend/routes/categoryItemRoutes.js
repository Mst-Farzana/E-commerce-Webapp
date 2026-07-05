const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer middleware
const CategoryItem = require('../models/CategoryItem');

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

// ====== Get all items (no limit) ======
router.get('/', async (req, res) => {
  try {
    const items = await CategoryItem.find({});
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// ====== Get all items by category (limit removed) ======
router.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // limit removed here, fetch all matching category items
    const items = await CategoryItem.find({ category });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// ====== Add item with image URL ======
router.post('/', async (req, res) => {
  try {
    const { category, name, details, img, price } = req.body;

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!name || !details || !img || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const item = new CategoryItem({ category, name, details, img, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving item' });
  }
});

// ====== Add item with uploaded image ======
router.post('/upload', upload.single('img'), async (req, res) => {
  try {
    const { category, name, details, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!name || !details || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const img = `/uploads/${req.file.filename}`;

    const item = new CategoryItem({ category, name, details, img, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving item' });
  }
});

// ====== Delete item by ID ======
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await CategoryItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== Update item by ID ======
router.put('/:id', async (req, res) => {
  const { category, name, details, img, price } = req.body;
  try {
    const existingItem = await CategoryItem.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!name || !details || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedItem = await CategoryItem.findByIdAndUpdate(
      req.params.id,
      { category, name, details, img, price },
      { new: true, runValidators: true }
    );
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
