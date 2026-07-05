const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, dob, gender, contactNo, email, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !dob ||
    !gender ||
    !contactNo ||
    !email ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: 'Please fill in all required fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      firstName,
      lastName,
      dob,
      gender,
      contactNo,
      email,
      password,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route (accepts email OR contactNo)
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or contact number

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email/contact and password' });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { contactNo: identifier }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid email/contact or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid email/contact or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
