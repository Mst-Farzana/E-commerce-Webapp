const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const fixAdminPassword = async (userId, newPassword) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await Admin.findOne({ userId: userId.toLowerCase() });
    if (!admin) return console.log('Admin not found');

    // Assign plain password and let pre-save hook hash it
    admin.password = newPassword;
    await admin.save(); // pre-save hook hashes it

    console.log(`✅ Password reset successfully for ${userId}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};


// 👇 make sure this line exists
fixAdminPassword('admin123', '123456');
