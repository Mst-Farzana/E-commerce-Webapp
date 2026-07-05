const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: not an admin' });
    }

    const adminUser = await Admin.findById(decoded.id).select('-password');
    if (!adminUser) {
      return res
        .status(401)
        .json({ message: 'Not authorized, admin not found' });
    }

    req.admin = adminUser;

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protectAdmin };
