// GridPulse AI - MongoDB Maintenance Model
// Tracks grid asset maintenance tickets and crew work orders

import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true
  },
  assetName: {
    type: String,
    default: ''
  },
  problem: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Warning', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  recommendation: {
    type: String,
    required: true
  },
  technician: {
    type: String,
    default: 'Unassigned'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed'],
    default: 'Pending'
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

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
