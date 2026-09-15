// GridPulse AI – JWT Auth Middleware + Role Guards

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { hasPermission, canAccessPage } from '../config/permissions.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gridpulse-secret-key-change-in-production';

// ─── Token Utilities ────────────────────────────────────────────────────────

export function signToken(payload, expiresIn = '8h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// ─── Middleware: Require valid JWT ──────────────────────────────────────────

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach user from DB (ensures deactivated accounts are rejected)
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account not found or deactivated.' });
    }

    req.user = user;
    req.role = user.role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

// ─── Middleware: Require specific role(s) ───────────────────────────────────

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }
    next();
  };
}

// ─── Middleware: Require a specific permission flag ──────────────────────────

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        error: `Access denied. You do not have '${permission}' permission.`,
        role: req.user.role
      });
    }
    next();
  };
}

// ─── Middleware: Employee asset scope filter ─────────────────────────────────
// Adds assetFilter to req so routes can scope queries by assigned assets

export function applyAssetScope(req, res, next) {
  if (req.user.role === 'employee' && req.user.assignedAssets?.length > 0) {
    req.assetFilter = { _id: { $in: req.user.assignedAssets } };
  } else {
    req.assetFilter = {}; // admin / manager see all
  }
  next();
}

export { JWT_SECRET };
