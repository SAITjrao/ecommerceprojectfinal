// Simple script to test cart functionality locally
// Add some sample products for testing

const sampleProducts = [
  {
    id: 1,
    product_id: 1,
    name: "Plastic Fork Set",
    price: 5.99,
    category: "cutlery",
    description: "Set of 50 plastic forks",
    stock: 100,
    image_url: "/categories/cutlery.jpg",
  },
  {
    id: 2,
    product_id: 2,
    name: "Paper Bowl Large",
    price: 8.99,
    category: "bowls",
    description: "Large disposable paper bowls",
    stock: 75,
    image_url: "/categories/bowls.jpg",
  },
  {
    id: 3,
    product_id: 3,
    name: "Plastic Cup 16oz",
    price: 4.5,
    category: "cups",
    description: "Clear plastic cups, 16oz capacity",
    stock: 200,
    image_url: "/categories/cups.jpg",
  },
  {
    id: 4,
    product_id: 4,
    name: "Paper Napkins",
    price: 3.25,
    category: "napkins",
    description: "2-ply paper napkins, pack of 100",
    stock: 150,
    image_url: "/categories/napkins.jpg",
  },
  {
    id: 5,
    product_id: 5,
    name: "Food Containers",
    price: 12.99,
    category: "containers",
    description: "Disposable food containers with lids",
    stock: 80,
    image_url: "/categories/containers.jpg",
  },
];

// Function to test cart operations
function testCartOperations() {
  console.log("Testing cart with sample products:");
  console.log(sampleProducts);

  // You can use these products to test:
  // 1. Add products to cart from the products page
  // 2. Modify quantities in cart page
  // 3. Remove items from cart
  // 4. Complete checkout process
}

// Run the test
testCartOperations();

export { sampleProducts };
