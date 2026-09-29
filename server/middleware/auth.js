import jwt from 'jsonwebtoken';
import { dbGet } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cg_rural_fssm_jwt_super_secret_key_2026';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch fresh user record from SQLite
    const user = await dbGet('SELECT id, name, email, phone, role, designation, district, block, gp, village, is_active FROM users WHERE id = ?', [decoded.id]);

    if (!user || user.is_active === 0) {
      return res.status(403).json({ success: false, message: 'Account is deactivated or does not exist.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Middleware to check required roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      district: user.district,
      block: user.block,
      gp: user.gp
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
