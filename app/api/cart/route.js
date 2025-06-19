import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  // Create a new cart for a user
  const { user_id } = await req.json();
  const { data, error } = await supabase
    .from("carts")
    .insert([{ user_id }])
    .select();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ cart: data[0] }), { status: 201 });
}

export async function PUT(req) {
  // Add or update cart item
  const { cart_id, product_id, quantity } = await req.json();
  // Check if item exists
  const { data: existing, error: findError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart_id)
    .eq("product_id", product_id);
  if (findError) {
    return new Response(JSON.stringify({ error: findError.message }), {
      status: 500,
    });
  }
  if (existing.length > 0) {
    // Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cart_id)
      .eq("product_id", product_id);
    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ message: "Quantity updated" }), {
      status: 200,
    });
  } else {
    // Insert new item
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert([{ cart_id, product_id, quantity }]);
    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ message: "Item added" }), {
      status: 201,
    });
  }
}

export async function GET(req) {
  // Get cart items for a cart
  const { searchParams } = new URL(req.url);
  const cart_id = searchParams.get("cart_id");
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart_id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ items: data }), { status: 200 });
}
