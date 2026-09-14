// GridPulse AI - MongoDB Asset Model
// Stores real-time telemetry and calculated risk metrics

import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  temperature: { 
    type: Number, 
    required: true 
  },
  load: { 
    type: Number, 
    required: true 
  },
  vibration: { 
    type: Number, 
    required: true 
  },
  humidity: { 
    type: Number, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  riskScore: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['Normal', 'Warning', 'High', 'Critical'] 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
