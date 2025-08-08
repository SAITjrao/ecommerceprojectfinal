import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  // Add product to wishlist
  const { user_id, product_id } = await req.json();

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .insert([{ user_id, product_id }])
      .select();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return new Response(
          JSON.stringify({ error: "Product already in wishlist" }),
          {
            status: 400,
          }
        );
      }
      if (error.code === "42P01") {
        // Table doesn't exist
        return new Response(
          JSON.stringify({
            error: "Wishlist table not found. Please run the database setup.",
          }),
          {
            status: 500,
          }
        );
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ wishlist_item: data[0] }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  // Remove product from wishlist
  const { user_id, product_id } = await req.json();

  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user_id)
      .eq("product_id", product_id);

    if (error) {
      if (error.code === "42P01") {
        // Table doesn't exist
        return new Response(
          JSON.stringify({
            error: "Wishlist table not found. Please run the database setup.",
          }),
          {
            status: 500,
          }
        );
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Removed from wishlist" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  // Get wishlist items for a user
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select(
        `
        *,
        products (
          id,
          name,
          price,
          quantity,
          category,
          image_url
        )
      `
      )
      .eq("user_id", user_id);

    if (error) {
      if (error.code === "42P01") {
        // Table doesn't exist - return empty wishlist instead of error
        return new Response(JSON.stringify({ wishlist: [] }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Transform the data to match the expected format
    const wishlist = data.map((item) => ({
      ...item.products,
      wishlist_id: item.id,
      added_at: item.created_at,
    }));

    return new Response(JSON.stringify({ wishlist }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
