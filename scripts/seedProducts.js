import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const categories = ["cutlery", "bowls", "cups", "napkins", "containers"];

const products = [
  // Cutlery
  {
    name: "Plastic Fork",
    price: 2.99,
    description: "Durable plastic fork",
    material: "Plastic",
    category: "cutlery",
    stock: 100,
  },
  {
    name: "Plastic Spoon",
    price: 2.99,
    description: "Durable plastic spoon",
    material: "Plastic",
    category: "cutlery",
    stock: 100,
  },
  {
    name: "Plastic Knife",
    price: 2.99,
    description: "Durable plastic knife",
    material: "Plastic",
    category: "cutlery",
    stock: 100,
  },
  {
    name: "Paper Straw",
    price: 1.99,
    description: "Eco-friendly paper straw",
    material: "Paper",
    category: "cutlery",
    stock: 100,
  },
  {
    name: "Wooden Chopsticks",
    price: 3.99,
    description: "Premium wooden chopsticks",
    material: "Wood",
    category: "cutlery",
    stock: 100,
  },
  // Bowls
  {
    name: "Paper Bowl",
    price: 4.99,
    description: "Biodegradable paper bowl",
    material: "Paper",
    category: "bowls",
    stock: 100,
  },
  {
    name: "Plastic Bowl",
    price: 5.99,
    description: "Reusable plastic bowl",
    material: "Plastic",
    category: "bowls",
    stock: 100,
  },
  {
    name: "Foam Bowl",
    price: 3.99,
    description: "Lightweight foam bowl",
    material: "Foam",
    category: "bowls",
    stock: 100,
  },
  {
    name: "Glass Bowl",
    price: 9.99,
    description: "Elegant glass bowl",
    material: "Glass",
    category: "bowls",
    stock: 100,
  },
  {
    name: "Ceramic Bowl",
    price: 8.99,
    description: "Classic ceramic bowl",
    material: "Ceramic",
    category: "bowls",
    stock: 100,
  },
  // Cups
  {
    name: "Plastic Cup",
    price: 2.49,
    description: "Reusable plastic cup",
    material: "Plastic",
    category: "cups",
    stock: 100,
  },
  {
    name: "Paper Cup",
    price: 2.99,
    description: "Disposable paper cup",
    material: "Paper",
    category: "cups",
    stock: 100,
  },
  {
    name: "Foam Cup",
    price: 1.99,
    description: "Insulated foam cup",
    material: "Foam",
    category: "cups",
    stock: 100,
  },
  {
    name: "Glass Cup",
    price: 6.99,
    description: "Elegant glass cup",
    material: "Glass",
    category: "cups",
    stock: 100,
  },
  {
    name: "Ceramic Mug",
    price: 7.99,
    description: "Classic ceramic mug",
    material: "Ceramic",
    category: "cups",
    stock: 100,
  },
  // Napkins
  {
    name: "Paper Napkin",
    price: 1.49,
    description: "Soft paper napkin",
    material: "Paper",
    category: "napkins",
    stock: 100,
  },
  {
    name: "Cloth Napkin",
    price: 4.99,
    description: "Reusable cloth napkin",
    material: "Cloth",
    category: "napkins",
    stock: 100,
  },
  {
    name: "Linen Napkin",
    price: 5.99,
    description: "Premium linen napkin",
    material: "Linen",
    category: "napkins",
    stock: 100,
  },
  {
    name: "Printed Napkin",
    price: 2.99,
    description: "Decorative printed napkin",
    material: "Paper",
    category: "napkins",
    stock: 100,
  },
  {
    name: "Cocktail Napkin",
    price: 1.99,
    description: "Small cocktail napkin",
    material: "Paper",
    category: "napkins",
    stock: 100,
  },
  // Containers
  {
    name: "Plastic Container",
    price: 6.99,
    description: "Reusable plastic container",
    material: "Plastic",
    category: "containers",
    stock: 100,
  },
  {
    name: "Paper Container",
    price: 5.99,
    description: "Disposable paper container",
    material: "Paper",
    category: "containers",
    stock: 100,
  },
  {
    name: "Foam Container",
    price: 4.99,
    description: "Insulated foam container",
    material: "Foam",
    category: "containers",
    stock: 100,
  },
  {
    name: "Glass Container",
    price: 12.99,
    description: "Premium glass container",
    material: "Glass",
    category: "containers",
    stock: 100,
  },
  {
    name: "Metal Container",
    price: 14.99,
    description: "Durable metal container",
    material: "Metal",
    category: "containers",
    stock: 100,
  },
];

async function seedProducts() {
  for (const product of products) {
    const { error } = await supabase.from("products").insert([product]);
    if (error) {
      console.error("Error inserting product:", product.name, error.message);
    } else {
      console.log("Inserted:", product.name);
    }
  }
  console.log("Seeding complete.");
}

seedProducts();
