const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'Dress',
        'Cosmetics',
        'Jewelry',
        'Bag',
        'Watch',
        'Phone',
        'Kids Item',
        'Shoe',
      ],
    },
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // SEO-friendly slug
    img: { type: String, required: true }, // single image or first image
    images: [String], // optional multiple images
    details: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 }, // optional inventory
    rating: { type: Number, default: 0 }, // average rating
    tags: [String], // for filtering/search
    colors: [String], // optional variations
  },
  {
    timestamps: true,
  }
);

// Helper function to generate a unique slug
async function generateUniqueSlug(model, name, suffix = '') {
  const baseSlug = slugify(name, { lower: true, strict: true });
  const newSlug = suffix ? `${baseSlug}-${suffix}` : baseSlug;

  const existing = await model.findOne({ slug: newSlug });
  if (!existing) {
    return newSlug;
  }
  // If slug exists, add a random suffix and retry
  const newSuffix = suffix ? suffix + 1 : 1;
  return generateUniqueSlug(model, name, newSuffix);
}

// Auto-generate slug before saving
itemSchema.pre('save', async function (next) {
  if (!this.slug || this.isModified('name')) {
    try {
      this.slug = await generateUniqueSlug(
        mongoose.model('CategoryItem'),
        this.name
      );
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('CategoryItem', itemSchema);
