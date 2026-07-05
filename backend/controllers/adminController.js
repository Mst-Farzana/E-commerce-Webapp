const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, userId: admin.userId, firstName: admin.firstName, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};


const generateRefreshToken = (admin) => {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET not defined');
  return jwt.sign(
    { id: admin._id, userId: admin.userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};


// -------------------- REGISTER --------------------
exports.registerAdmin = async (req, res) => {
  try {
    const { userId, firstName, lastName, password } = req.body;

    if (!userId || !firstName || !lastName || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ userId: userId.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    // Create admin (pre-save hook auto-hashes password)
    const admin = await Admin.create({
      userId: userId.toLowerCase(),
      firstName,
      lastName,
      password,
    });

    // Fetch hashed password explicitly for debug
    const registeredAdmin = await Admin.findById(admin._id).select('+password');
    console.log("✅ Registered admin details:");
    console.log("UserID:", registeredAdmin.userId);
    console.log("Password hash stored in DB:", registeredAdmin.password);

    res.status(201).json({
      message: 'Admin registered',
      user: {
        id: admin._id,
        userId: admin.userId,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------- LOGIN --------------------
exports.loginAdmin = async (req, res) => {
  try {
    console.log("🔥 Login API hit"); 

    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }

    // Fetch admin and include password
    const admin = await Admin.findOne({ userId: userId.toLowerCase() }).select('+password');
    if (!admin) {
      console.log("❌ Admin not found:", userId);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`➡️ Entered password: ${password}`);
    console.log(`➡️ Stored hash: ${admin.password}`);

    // Compare password using model method
    const isMatch = await admin.matchPassword(password);
    console.log(`✅ Password match result: ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);
     console.log('✅ Tokens generated successfully');

   // First log for debugging
console.log('Sending response:', {
  accessToken,
  refreshToken,
  user: {
    id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    userId: admin.userId,
    role: admin.role,
  },
});

// Then send the response
res.json({
  accessToken,
  refreshToken,
  user: {
    id: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    userId: admin.userId,
    role: admin.role,
  },
});

  
  } catch (error) {
    console.error('Login admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
