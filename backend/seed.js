import { initializeDatabase, sequelize } from './config/db.js';
import Asset from './models/Asset.js';
import Maintenance from './models/Maintenance.js';
import User from './models/User.js';

const INITIAL_USERS = [
  {
    email: 'admin@voltguard.com',
    password: 'password123',
    name: 'Ananya Sharma',
    title: 'Grid Operations Director',
    role: 'admin'
  },
  {
    email: 'tech@voltguard.com',
    password: 'password123',
    name: 'Rahul Verma',
    title: 'Lead Field Technician',
    role: 'technician'
  },
  {
    email: 'viewer@voltguard.com',
    password: 'password123',
    name: 'Dr. Vikram Singh',
    title: 'Data Scientist',
    role: 'viewer'
  }
];

const INITIAL_ASSETS_DATA = [
  {
    name: 'Pine Valley Transformer T-01',
    type: 'Transformer',
    location: 'Pine Valley Substation Yard 1',
    temperature: 96,
    load: 92,
    vibration: 4.8,
    humidity: 65,
    age: 18,
    riskScore: 92,
    status: 'Critical'
  },
  {
    name: 'Substation Transformer T-02',
    type: 'Transformer',
    location: 'Central Metro Substation Yard 3',
    temperature: 74,
    load: 68,
    vibration: 2.7,
    humidity: 58,
    age: 12,
    riskScore: 58,
    status: 'Warning'
  },
  {
    name: 'Westside Feeder F-01',
    type: 'Feeder',
    location: 'Westside Industrial Park Corridor',
    temperature: 52,
    load: 42,
    vibration: 1.2,
    humidity: 50,
    age: 6,
    riskScore: 24,
    status: 'Normal'
  },
  {
    name: 'Harbor Transformer T-03',
    type: 'Transformer',
    location: 'Harbor Port Marine Substation',
    temperature: 85,
    load: 82,
    vibration: 3.9,
    humidity: 82,
    age: 22,
    riskScore: 78,
    status: 'High'
  },
  {
    name: 'North Grid Feeder F-02',
    type: 'Feeder',
    location: 'North Residential Valley Line',
    temperature: 46,
    load: 35,
    vibration: 0.9,
    humidity: 48,
    age: 4,
    riskScore: 18,
    status: 'Normal'
  }
];

const INITIAL_MAINTENANCE_DATA = [
  {
    assetId: '1',
    assetName: 'Pine Valley Transformer T-01',
    problem: 'Transformer Overheating & Cooling Fan Inefficiency',
    priority: 'Critical',
    recommendation: 'Inspect radiator cooling fans, clean debris, and test pump flow rate.',
    technician: 'Marcus Vance',
    status: 'In Progress'
  },
  {
    assetId: '4',
    assetName: 'Harbor Transformer T-03',
    problem: 'Moisture Ingress & Elevated Winding Heat',
    priority: 'High',
    recommendation: 'Replace silica gel breather cartridge and test dielectric oil breakdown voltage.',
    technician: 'Elena Rodriguez',
    status: 'Assigned'
  }
];

export async function seedDatabase() {
  try {
    await initializeDatabase();
    
    // Sync models
    await sequelize.sync({ force: true }); // Warning: Drops tables
    console.log('✅ Database schemas synced.');

    // Seed Users
    for (const user of INITIAL_USERS) {
      await User.create(user);
    }
    console.log('✅ Users seeded successfully.');

    // Seed Assets
    const createdAssets = [];
    for (const asset of INITIAL_ASSETS_DATA) {
      const newAsset = await Asset.create(asset);
      createdAssets.push(newAsset);
    }
    console.log('✅ Assets seeded successfully.');

    // Seed Maintenance using actual UUIDs from assets
    for (let i = 0; i < INITIAL_MAINTENANCE_DATA.length; i++) {
      const maint = INITIAL_MAINTENANCE_DATA[i];
      // Map mock ID to real UUID
      maint.assetId = createdAssets[i === 0 ? 0 : 3].id;
      await Maintenance.create(maint);
    }
    console.log('✅ Maintenance seeded successfully.');
    
    console.log('✅ Entire Database seeded successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}
