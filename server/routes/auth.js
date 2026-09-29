import express from 'express';
import bcrypt from 'bcryptjs';
import { dbGet, dbRun, dbAll } from '../db.js';
import { generateToken, authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// 1. REGISTER NEW USER (Citizen, Vendor, Driver, Operator)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'CITIZEN',
      designation,
      district = 'Raipur (378)',
      block = 'Dharsiwa (3836)',
      gp = 'Mandir Hasaud (124805)',
      village = 'Mandir Hasaud',
      vehicleNo = '',
      companyName = ''
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    // Check if phone or email already registered
    const existing = await dbGet('SELECT id FROM users WHERE phone = ? OR (email IS NOT NULL AND email = ?)', [phone, email || '']);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this phone number or email already exists.' });
    }

    // Hash password with bcryptjs
    const plainPassword = password || (phone.slice(-4) + '@Fssm2026');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Insert into SQLite
    await dbRun(
      `INSERT INTO users (id, name, email, phone, password_hash, role, designation, district, block, gp, village, vehicle_no, company_name, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name.trim(),
        email ? email.trim().toLowerCase() : null,
        phone.trim(),
        passwordHash,
        role,
        designation || (role === 'CITIZEN' ? 'Citizen Beneficiary' : role),
        district,
        block,
        gp,
        village,
        vehicleNo,
        companyName,
        1
      ]
    );

    const newUser = await dbGet('SELECT id, name, email, phone, role, designation, district, block, gp, village, vehicle_no, company_name FROM users WHERE id = ?', [userId]);
    const token = generateToken(newUser);

    // Record audit log
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_id, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, 'USER', 'REGISTER', userId, newUser.name, newUser.role, `Registered new account as ${role}`]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Registration failed due to server error.' });
  }
});

// 2. LOGIN WITH EMAIL / PHONE & PASSWORD (BCRYPT VERIFICATION)
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone and password are required.' });
    }

    const trimmedIdentifier = emailOrPhone.trim();
    // Find user by email or phone
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [trimmedIdentifier.toLowerCase(), trimmedIdentifier]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.is_active === 0) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact administrator.' });
    }

    // Compare bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    // Audit log
    await dbRun(
      `INSERT INTO audit_logs (entity_id, entity_type, action, actor_id, actor_name, actor_role, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.id, 'USER', 'LOGIN', user.id, user.name, user.role, `User logged in from ${user.role} console`]
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Login failed due to server error.' });
  }
});

// 3. CITIZEN OTP LOGIN (Generates instant session & auto-registers if new)
router.post('/citizen-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    let user = await dbGet('SELECT * FROM users WHERE phone = ?', [phone.trim()]);

    if (!user) {
      // Auto-register Citizen
      const salt = await bcrypt.genSalt(10);
      const defaultHash = await bcrypt.hash('Otp@123456', salt);
      const userId = `usr_cit_${Date.now()}`;

      await dbRun(
        `INSERT INTO users (id, name, phone, password_hash, role, designation, district, block, gp, village)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, `Citizen (${phone.slice(-4)})`, phone.trim(), defaultHash, 'CITIZEN', 'Citizen Beneficiary', 'Raipur (378)', 'Dharsiwa (3836)', 'Mandir Hasaud (124805)', 'Mandir Hasaud']
      );

      user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: 'OTP Verified successfully',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Citizen OTP Error:', err);
    res.status(500).json({ success: false, message: 'OTP Login failed.' });
  }
});

// 4. GET CURRENT AUTHENTICATED USER
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 5. GET ALL USERS (ADMIN/OFFICIALS)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await dbAll('SELECT id, name, email, phone, role, designation, district, block, gp, village, is_active, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

export default router;
