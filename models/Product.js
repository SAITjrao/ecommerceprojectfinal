// models/Product.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize.js'; // 🔁 changed from '@/lib/sequelize'

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL(10, 2),
  description: DataTypes.TEXT,
  material: DataTypes.ENUM('Foam', 'Paper', 'Plastic'),
  quantity: DataTypes.INTEGER,
  category: DataTypes.ENUM('Containers', 'Bowls', 'Cups', 'Cutlery', 'Napkins'),
  stock: DataTypes.INTEGER,
}, {
  tableName: 'products',
  timestamps: false
});

export default Product;
