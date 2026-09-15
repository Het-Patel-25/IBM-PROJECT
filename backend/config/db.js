import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Acpc@2025',
  database: 'voltguard_db'
};

// Auto-create database if it doesn't exist
export async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Database '${dbConfig.database}' ensured to exist.`);
    await connection.end();
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
  }
}

export const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
