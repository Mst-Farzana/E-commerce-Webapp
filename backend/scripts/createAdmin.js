const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Delete existing admin if exists
    await Admin.deleteOne({ userId: process.env.ADMIN_USER_ID });

    // Create new admin
    const newAdmin = new Admin({
      userId: process.env.ADMIN_USER_ID,
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      password: process.env.ADMIN_PASSWORD, // will be hashed automatically by pre-save hook
    });
    await newAdmin.save();

    console.log('✅ Admin user created successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
