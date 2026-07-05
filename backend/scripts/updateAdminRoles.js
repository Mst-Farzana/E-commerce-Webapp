const mongoose = require('mongoose');
const Admin = require('../models/Admin'); // path ঠিক করুন
require('dotenv').config();

const updateRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Admin.updateMany(
      { role: { $exists: false } },
      { role: 'admin' }
    );

    console.log(`Updated ${result.modifiedCount} admins with role 'admin'`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateRoles();
