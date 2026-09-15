import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: { 
    type: DataTypes.ENUM('admin', 'technician', 'viewer'),
    allowNull: false,
    defaultValue: 'viewer'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;
