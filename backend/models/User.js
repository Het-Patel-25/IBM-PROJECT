// GridPulse AI – User Model (RBAC + 2FA)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Role definitions with permission scopes
// admin             → full system access
// department_manager → view all assets, manage maintenance, view predictions (no user mgmt)
// employee          → view assigned assets, view maintenance tasks, no prediction/risk write

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'department_manager', 'employee'],
    default: 'employee'
  },
  // Department assignment — used to filter which assets/maintenance the user sees
  department: {
    type: String,
    default: 'General'
  },
  // Assigned asset IDs (for employee role scope)
  assignedAssets: [{
    type: String
  }],

  // --- Two-Factor Authentication (TOTP via speakeasy) ---
  twoFactorSecret: {
    type: String,
    default: null
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  // Temporary secret stored during 2FA setup before verification
  twoFactorTempSecret: {
    type: String,
    default: null
  },

  // Account state
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.password;
      delete ret.twoFactorSecret;
      delete ret.twoFactorTempSecret;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
