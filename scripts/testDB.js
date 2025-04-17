// scripts/testDB.js
import sequelize from '../lib/sequelize.js';
import Product from '../models/Product.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    const products = await Product.findAll();
    console.log('📦 Products:', products.map(p => p.toJSON()));
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
