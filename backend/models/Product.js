const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    discount: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 }); // Optional, improves queries filtering by category

module.exports = mongoose.model('Product', productSchema);
