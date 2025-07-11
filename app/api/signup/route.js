import { User } from "../../../models/User";

export async function POST(req) {
  try {
    const data = await req.json();

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
