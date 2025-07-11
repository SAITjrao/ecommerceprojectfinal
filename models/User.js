import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize.js';

const CanadianProvinces = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 
  'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  address: DataTypes.STRING,
  postalcode: DataTypes.STRING,
  city: DataTypes.STRING,
  province: {
    type: DataTypes.ENUM(...CanadianProvinces),
    allowNull: false
  },
  phone: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  business_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cuisine_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kitchen_size: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: false
});

export { User };
