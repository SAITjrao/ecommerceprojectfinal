import { Product } from "../../../models/Product";
import { User } from "../../../models/User";

export async function GET(req) {
  try {
    const userId = req.headers.get("user-id");

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
    );
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(
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
    );
  }
}
