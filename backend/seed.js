require('dotenv').config();
const mongoose = require('mongoose');
const Discount = require('./models/discountModel');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDiscounts = async () => {
  try {
    console.log('🧹 Clearing existing discounts...');
    await Discount.deleteMany();

    console.log('📦 Inserting new discounts...');
    await Discount.insertMany([
      {
        name: 'T-shirt',
        offer: 2,
        img: 'https://img.icons8.com/arcade/64/t-shirt.png',
      },
      {
        name: 'Shoes',
        offer: 3,
        img: 'https://img.icons8.com/color-glass/48/women-shoe-diagonal-view.png',
      },
      {
        name: 'Jewelry',
        offer: 5,
        img: 'https://img.icons8.com/color/48/jewelry.png',
      },
      {
        name: 'Watch',
        offer: 4,
        img: 'https://img.icons8.com/3d-fluency/50/watches-front-view.png',
      },
      {
        name: 'Bag',
        offer: 1,
        img: 'https://img.icons8.com/3d-fluency/50/bag-front-view.png',
      },
    ]);

    console.log('✅ Discount data seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

connectDB().then(seedDiscounts);
