import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://gzynanstdhaawvpkdjhc.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eW5hbnN0ZGhhYXd2cGtkamhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUzODYsImV4cCI6MjA2NDY0MTM4Nn0.Ek_UmrxQ20k6ysejQnSK9Gt-EyKSEYJmN2hHSgRFLKc"
);
const dummyOrders = [
  {
    order_id: "ORD-2024-001",
    user_id: "user123",
    total_amount: 45.97,
    status: "processing",
    created_at: "2024-01-15T10:30:00Z",
    items: [
      { id: 1, quantity: 2, price: 2.99 },
      { id: 2, quantity: 2, price: 2.99 },
      { id: 6, quantity: 3, price: 4.99 },
      { id: 11, quantity: 4, price: 2.49 },
      { id: 16, quantity: 5, price: 1.49 },
    ],
  },
  {
    order_id: "ORD-2024-002",
    user_id: "user456",
    total_amount: 32.45,
    status: "shipped",
    created_at: "2024-01-14T14:20:00Z",
    items: [
      { id: 3, quantity: 1, price: 2.99 },
      { id: 7, quantity: 2, price: 5.99 },
      { id: 12, quantity: 3, price: 2.99 },
      { id: 17, quantity: 2, price: 4.99 },
    ],
  },
  {
    order_id: "ORD-2024-003",
    user_id: "user789",
    total_amount: 67.89,
    status: "delivered",
    created_at: "2024-01-13T09:15:00Z",
    items: [
      { id: 4, quantity: 3, price: 1.99 },
      { id: 8, quantity: 1, price: 3.99 },
      { id: 13, quantity: 2, price: 1.99 },
      { id: 18, quantity: 1, price: 5.99 },
      { id: 21, quantity: 2, price: 6.99 },
      { id: 22, quantity: 1, price: 5.99 },
    ],
  },
  {
    order_id: "ORD-2024-004",
    user_id: "user101",
    total_amount: 28.5,
    status: "received",
    created_at: "2024-01-16T16:45:00Z",
    items: [
      { id: 5, quantity: 2, price: 3.99 },
      { id: 9, quantity: 1, price: 9.99 },
      { id: 14, quantity: 2, price: 6.99 },
      { id: 19, quantity: 1, price: 2.99 },
    ],
  },
  {
    order_id: "ORD-2024-005",
    user_id: "user202",
    total_amount: 89.95,
    status: "pickup",
    created_at: "2024-01-12T11:30:00Z",
    items: [
      { id: 10, quantity: 1, price: 8.99 },
      { id: 15, quantity: 2, price: 7.99 },
      { id: 20, quantity: 1, price: 4.99 },
      { id: 23, quantity: 1, price: 12.99 },
      { id: 24, quantity: 1, price: 14.99 },
      { id: 25, quantity: 2, price: 14.99 },
    ],
  },
];

async function seedOrders() {
  console.log("Starting to seed orders...");

  for (const order of dummyOrders) {
    try {
      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            order_id: order.order_id,
            user_id: order.user_id,
            total_amount: order.total_amount,
            status: order.status,
            created_at: order.created_at,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error(
          `Error inserting order ${order.order_id}:`,
          orderError.message
        );
        continue;
      }

      console.log(`Inserted order: ${order.order_id}`);

      // Insert order items
      const orderItems = order.items.map((item) => ({
        order_id: order.order_id,
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("orderitems")
        .insert(orderItems);

      if (itemsError) {
        console.error(
          `Error inserting items for order ${order.order_id}:`,
          itemsError.message
        );
      } else {
        console.log(
          `Inserted ${order.items.length} items for order ${order.order_id}`
        );
      }
    } catch (error) {
      console.error(`Error processing order ${order.order_id}:`, error.message);
    }
  }

  console.log("Order seeding complete.");
}

seedOrders();
