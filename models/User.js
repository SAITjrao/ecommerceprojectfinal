// REPLACE IF NEEDED OR USE

// import { DataTypes } from 'sequelize';
// import sequelize from '../lib/sequelize.js';
import Image from 'next/image';

// const CanadianProvinces = [
//   'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 
//   'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
// ];

// const User = sequelize.define('User', {
//   user_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   first_name: DataTypes.STRING,
//   last_name: DataTypes.STRING,
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true
//     }
//   },
//   address: DataTypes.STRING,
//   postalcode: DataTypes.STRING,
//   city: DataTypes.STRING,
//   province: {
//     type: DataTypes.ENUM(...CanadianProvinces),
//     allowNull: false
//   },
//   phone: DataTypes.STRING,
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   }
// }, {
//   tableName: 'users',
//   timestamps: false
// });

// export default User;

<Image src="/path/to/image.jpg" alt="description" width={500} height={300} />