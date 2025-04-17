// scripts/testDB.js
import sequelize from '../lib/sequelize.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

async function getProducts() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    const products = await Product.findAll();
    return products;
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

async function getUser(email, password) {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    console.log(user.first_name);
    console.log(user.last_name);

    return user;
  } catch (err) {
    console.error('Error in getUser:', err.message);
    throw err;
  }
}

 export {getUser, getProducts};