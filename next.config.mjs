/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// Load environment variables manually
dotenv.config();
const nextConfig = {
    webpack(config, { isServer }) {
      // Suppress Sequelize dynamic require warning
      if (isServer) {
        config.module.exprContextCritical = false;
      }
      return config;
    },
  };
  
  export default nextConfig;
  