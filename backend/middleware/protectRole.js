
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectRole = (roles, options = { debug: false }) => async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) return res.status(403).json({ message: 'Access denied' });

    const user = await Admin.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

   


    const roleArray = Array.isArray(roles) ? roles : [roles];

    if (!roleArray.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    if (options.debug) {
      console.log('✅ Authorized user:', user.userId, '| Role:', user.role);
    }

    req.admin = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ message: 'Token verification failed' });
  }
};


module.exports = protectRole;
