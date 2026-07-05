const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin'); // your Admin model

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testLogin = async (userId, password) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 MongoDB Connected');

    // Fetch admin with password
    const admin = await Admin.findOne({ userId: userId.toLowerCase() }).select('+password');
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('Entered password:', password);
    console.log('Stored hash:', admin.password);

    // check password using your schema method
    const isMatch = await admin.matchPassword(password);
    if (isMatch) {
      console.log('✅ Login success! UserId & password match.');
    } else {
      console.log('❌ Login failed! Password does not match.');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Test with your credentials
testLogin('admin123', '123456');
