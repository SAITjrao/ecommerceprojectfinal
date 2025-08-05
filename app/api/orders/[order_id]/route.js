import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  try {
    const { order_id } = params;

    if (!order_id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order with order items and product details
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        orderitems (
          *,
          products (
            id,
            name,
            price,
            category,
            image_url
          )
        )
      `
      )
      .eq("id", order_id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
      console.error("Order fetch error:", error);
      return NextResponse.json(
        { message: "Failed to fetch order" },
        { status: 500 }
      );
    }

    // Transform the data to a more usable format
    const transformedOrder = {
      order_id: order.id,
      user_id: order.user_id,
      total_amount: order.total_amount,
      status: order.status,
      order_date: order.order_date,
      payment_status: order.payment_status,
      items: order.orderitems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.products?.name || "Unknown Product",
        category: item.products?.category || "Unknown",
        image_url: item.products?.image_url || null,
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { order_id } = params;
    const { status } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    // Valid status values
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "pickup",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update order status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", order_id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
      console.error("Order update error:", error);
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: order.id,
      status: order.status,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
