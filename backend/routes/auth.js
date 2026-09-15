// GridPulse AI – Auth Routes
// POST /api/auth/signup
// POST /api/auth/login
// POST /api/auth/verify-2fa
// GET  /api/auth/setup-2fa
// POST /api/auth/confirm-2fa
// POST /api/auth/disable-2fa
// GET  /api/auth/me
// GET  /api/auth/users          (admin only)
// PATCH /api/auth/users/:id     (admin only)
// DELETE /api/auth/users/:id    (admin only)

import express from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import User from '../models/User.js';
import { signToken, requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ─── POST /api/auth/signup ─────────────────────────────────────────────────

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    // Only allow admin creation via special header or if no users exist yet
    const userCount = await User.countDocuments();
    let assignedRole = 'employee';
    if (role && ['admin', 'department_manager', 'employee'].includes(role)) {
      // First user always becomes admin
      if (userCount === 0) {
        assignedRole = 'admin';
      } else {
        assignedRole = role;
      }
    } else if (userCount === 0) {
      assignedRole = 'admin';
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = new User({
      name,
      email,
      password,
      role: assignedRole,
      department: department || 'General'
    });
    await user.save();

    // Issue token — no 2FA required on first sign-up (they set it up after)
    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toJSON(),
      requiresTwoFactor: false
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +twoFactorSecret +twoFactorEnabled');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // If 2FA is enabled, return partial token requiring OTP verification
    if (user.twoFactorEnabled) {
      // Issue a short-lived pre-auth token
      const preAuthToken = signToken({ id: user._id, step: 'pre-2fa' }, '5m');
      return res.json({
        requiresTwoFactor: true,
        preAuthToken,
        message: 'Enter your 6-digit authenticator code to continue.'
      });
    }

    // No 2FA – issue full session token
    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    res.json({
      requiresTwoFactor: false,
      token,
      user: user.toJSON()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/auth/verify-2fa ─────────────────────────────────────────────
// Submit OTP code after login when 2FA is enabled

router.post('/verify-2fa', async (req, res) => {
  try {
    const { preAuthToken, code } = req.body;
    if (!preAuthToken || !code) {
      return res.status(400).json({ error: 'Pre-auth token and OTP code required.' });
    }

    let decoded;
    try {
      const jwt = await import('jsonwebtoken');
      const { JWT_SECRET } = await import('../middleware/auth.js');
      decoded = jwt.default.verify(preAuthToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Pre-auth token expired or invalid. Please log in again.' });
    }

    if (decoded.step !== 'pre-2fa') {
      return res.status(401).json({ error: 'Invalid token type.' });
    }

    const user = await User.findById(decoded.id).select('+twoFactorSecret +twoFactorEnabled');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account not found.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code.replace(/\s/g, ''),
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid or expired authenticator code.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/auth/setup-2fa ───────────────────────────────────────────────
// Authenticated: generate a TOTP secret and QR code for the user

router.get('/setup-2fa', requireAuth, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `GridPulse AI (${req.user.email})`,
      issuer: 'GridPulse AI'
    });

    // Store temp secret (not confirmed yet)
    req.user.twoFactorTempSecret = secret.base32;
    await req.user.save();

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret.base32
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/auth/confirm-2fa ────────────────────────────────────────────
// Confirm setup by verifying the first OTP code from the authenticator

router.post('/confirm-2fa', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id).select('+twoFactorTempSecret +twoFactorSecret +twoFactorEnabled');

    if (!user.twoFactorTempSecret) {
      return res.status(400).json({ error: 'No pending 2FA setup found. Run setup first.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorTempSecret,
      encoding: 'base32',
      token: code.replace(/\s/g, ''),
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid code. Scan the QR code again and retry.' });
    }

    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorTempSecret = null;
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: 'Two-factor authentication enabled successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/auth/disable-2fa ────────────────────────────────────────────

router.post('/disable-2fa', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorEnabled');

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not currently enabled.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code.replace(/\s/g, ''),
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid code. Cannot disable 2FA.' });
    }

    user.twoFactorSecret = null;
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ message: 'Two-factor authentication disabled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/auth/me ──────────────────────────────────────────────────────

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorEnabled');
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/auth/users (admin only) ─────────────────────────────────────

router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(u => u.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/auth/users/:id (admin only) ────────────────────────────────

router.patch('/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const allowedFields = ['name', 'role', 'department', 'assignedAssets', 'isActive'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/auth/users/:id (admin only) ───────────────────────────────

router.delete('/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
