import { supabase } from "@/lib/supabaseClient";

export async function GET(request, context) {
  const params = await context.params;
  const category = params?.category;
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category);
    if (error) throw new Error(error.message);
    return Response.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Supabase error:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
