import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://gzynanstdhaawvpkdjhc.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eW5hbnN0ZGhhYXd2cGtkamhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUzODYsImV4cCI6MjA2NDY0MTM4Nn0.Ek_UmrxQ20k6ysejQnSK9Gt-EyKSEYJmN2hHSgRFLKc"
);

async function clearProducts() {
  console.log("Clearing existing products...");

  try {
    // Delete all products
    const { error } = await supabase
      .from("products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all products

    if (error) {
      console.error("Error clearing products:", error);
    } else {
      console.log("All products cleared successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

clearProducts();
