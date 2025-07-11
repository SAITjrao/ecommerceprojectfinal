<<<<<<< Updated upstream
import { Product } from "../../../models/Product";
import { User } from "../../../models/User";
=======
import { supabase } from "../../../lib/supabaseClient";
>>>>>>> Stashed changes

export async function GET(req) {
  try {
    const userId = req.headers.get("user-id");
<<<<<<< Updated upstream

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
          products: [],
        }),
        {
          status: 400,
        }
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
          products: [],
        }),
        {
          status: 404,
        }
      );
    }

    const recommendedProducts = await Product.findAll({
      where: {
        business_type: user.business_type,
        cuisine_type: user.cuisine_type,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        products: recommendedProducts || [],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
=======
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required", products: [] }),
        { status: 400 }
      );
    }

    // Get user preferences
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("business_type, cuisine_type")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found", products: [] }),
        { status: 404 }
      );
    }

    // Get recommended products
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("business_type", user.business_type)
      .eq("cuisine_type", user.cuisine_type);

    if (prodError) throw prodError;

    return new Response(
      JSON.stringify({ success: true, products: products || [] }),
      { status: 200 }
>>>>>>> Stashed changes
    );
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(
<<<<<<< Updated upstream
      JSON.stringify({
        success: false,
        message: error.message,
        products: [],
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
=======
      JSON.stringify({ success: false, message: error.message, products: [] }),
      { status: 500 }
>>>>>>> Stashed changes
    );
  }
}
