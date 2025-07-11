import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { user_id, items, total_amount } = await request.json();

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id, total_amount }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('orderitems')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json({ order_id: order.order_id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}