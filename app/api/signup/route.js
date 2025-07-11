<<<<<<< Updated upstream
import { User } from "../../../models/User";
=======
import { supabase } from "../../../lib/supabaseClient";
>>>>>>> Stashed changes

export async function POST(req) {
  try {
    const data = await req.json();

<<<<<<< Updated upstream
    const newUser = await User.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      business_type: data.businessType,
      location: data.location,
      cuisine_type: data.cuisineType,
      kitchen_size: data.kitchenSize,
    });

    return new Response(JSON.stringify({ success: true, user: newUser }), {
=======
    const { error, data: user } = await supabase
      .from("users")
      .insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          business_type: data.businessType,
          location: data.location,
          cuisine_type: data.cuisineType,
          kitchen_size: data.kitchenSize,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, user }), {
>>>>>>> Stashed changes
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
      }
    );
  }
}
