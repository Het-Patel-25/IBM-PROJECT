import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assetId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  assetName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  problem: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  priority: { 
    type: DataTypes.ENUM('Low', 'Warning', 'High', 'Critical'),
    allowNull: false 
  },
  recommendation: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  technician: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('Pending', 'Assigned', 'In Progress', 'Completed'),
    allowNull: false 
  }
}, {
  timestamps: true
});

export default Maintenance;
