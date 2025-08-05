# Database Setup Guide

This guide explains how to set up the database for the ecommerce application.

## Quick Setup

### 1. Database Tables Setup

Run the SQL queries in `database_setup.sql` in your Supabase SQL editor or PostgreSQL database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database_setup.sql`
4. Execute the queries

This will create all necessary tables:

- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Order records
- `orderitems` - Individual items in orders
- `carts` - Shopping carts
- `cartitems` - Items in shopping carts
- `wishlist` - User wishlists

### 2. Sample Data (Optional)

If you want to populate the database with sample data, run these scripts:

```bash
# Seed products with sample data
node scripts/seedProducts.js

# Seed orders with sample data (requires products to exist first)
node scripts/seedOrders.js
```

### 3. Clear Data (If Needed)

To clear existing data:

```bash
# Clear all products
node scripts/clearProducts.js
```

## Table Structure

### Users Table

- `id` (UUID) - Primary key
- `fname` (VARCHAR) - First name
- `lname` (VARCHAR) - Last name
- `email` (VARCHAR) - Unique email
- `password_hash` (VARCHAR) - Hashed password
- `phone` (VARCHAR) - Phone number
- `address` (TEXT) - Address
- `city` (VARCHAR) - City
- `business_type` (VARCHAR) - Business type
- `created_at` (TIMESTAMP) - Creation date
- `is_admin` (BOOLEAN) - Admin flag

### Products Table

- `id` (SERIAL) - Primary key
- `name` (VARCHAR) - Product name
- `price` (DECIMAL) - Product price
- `description` (TEXT) - Product description
- `material` (VARCHAR) - Material type
- `quantity` (INTEGER) - Quantity
- `category` (VARCHAR) - Product category
- `stock` (INTEGER) - Stock level
- `image_url` (VARCHAR) - Product image URL
- `sku` (VARCHAR) - Stock keeping unit
- `created_at` (TIMESTAMP) - Creation date

### Orders Table

- `id` (SERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users
- `total_amount` (DECIMAL) - Order total
- `status` (VARCHAR) - Order status
- `order_date` (TIMESTAMP) - Order date
- `payment_status` (VARCHAR) - Payment status

### Order Items Table

- `id` (UUID) - Primary key
- `order_id` (INTEGER) - Foreign key to orders
- `product_id` (INTEGER) - Foreign key to products
- `quantity` (INTEGER) - Item quantity
- `price` (DECIMAL) - Item price
- `created_at` (TIMESTAMP) - Creation date

### Carts Table

- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

### Cart Items Table

- `id` (UUID) - Primary key
- `cart_id` (UUID) - Foreign key to carts
- `product_id` (INTEGER) - Foreign key to products
- `quantity` (INTEGER) - Item quantity
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

### Wishlist Table

- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `product_id` (INTEGER) - Foreign key to products
- `created_at` (TIMESTAMP) - Creation date
- Unique constraint on (user_id, product_id)

## Order Statuses

The system supports the following order statuses:

- `pending` - Order placed, awaiting processing
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `pickup` - Order ready for pickup (cannot be changed once set)
- `cancelled` - Order has been cancelled

## Admin Setup

To create an admin user, run this SQL query:

```sql
INSERT INTO users (id, fname, lname, email, password_hash, is_admin)
VALUES (
  gen_random_uuid(),
  'Admin',
  'User',
  'admin@example.com',
  'your_hashed_password_here',
  true
);
```

## Security Notes

- The SQL file includes commented RLS (Row Level Security) commands
- Enable RLS and set up appropriate policies based on your security requirements
- Always use proper password hashing in production
- Consider implementing proper authentication middleware

## Troubleshooting

1. **Foreign Key Errors**: Ensure tables are created in the correct order
2. **Permission Errors**: Check your database user permissions
3. **RLS Issues**: Disable RLS temporarily for testing, then enable with proper policies
4. **Connection Issues**: Verify your Supabase credentials and connection settings
