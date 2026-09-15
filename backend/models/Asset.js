import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  location: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  temperature: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  load: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  vibration: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  humidity: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  age: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  riskScore: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('Normal', 'Warning', 'High', 'Critical'),
    allowNull: false 
  }
}, {
  timestamps: true
});

export default Asset;
