import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { user_id, items, total_amount, tax } = await request.json();

    // Validate input
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    // Start a transaction by creating the order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          total_amount,
          status: "pending",
          payment_status: "pending",
          order_date: new Date().toISOString(),
          tax
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { message: "Failed to create order" },
        { status: 500 }
      );
    }

    // Prepare order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id || item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Insert order items
    const { error: itemsError } = await supabase
      .from("orderitems")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // Try to clean up the order if items insertion fails
      await supabase.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        { message: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        order_id: order.id,
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 20;

    // If user_id is provided, get orders for that specific user
    if (user_id) {
      // Get orders with order items and product details
      const { data: orders, error } = await supabase
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
        .eq("user_id", user_id)
        .order("order_date", { ascending: false });

      if (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
          { message: "Failed to fetch orders" },
          { status: 500 }
        );
      }

      // Transform the data to a more usable format
      const transformedOrders = orders.map((order) => ({
        order_id: order.id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        order_date: order.order_date,
        payment_status: order.payment_status,
        items: order.orderitems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.products?.name || "Unknown Product",
          category: item.products?.category || "Unknown",
          image_url: item.products?.image_url || null,
        })),
      }));

      return NextResponse.json({ orders: transformedOrders });
    } else {
      // Admin panel: get all orders with pagination
      const offset = (page - 1) * pageSize;

      // Get total count
      const { count, error: countError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Orders count error:", countError);
        return NextResponse.json(
          { message: "Failed to fetch orders count" },
          { status: 500 }
        );
      }

      // Get orders with pagination
      const { data: orders, error } = await supabase
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
        .order("order_date", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error("Orders fetch error:", error);
        return NextResponse.json(
          { message: "Failed to fetch orders" },
          { status: 500 }
        );
      }

      // Transform the data to a more usable format
      const transformedOrders = orders.map((order) => ({
        order_id: order.id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        order_date: order.order_date,
        payment_status: order.payment_status,
        items: order.orderitems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.products?.name || "Unknown Product",
          category: item.products?.category || "Unknown",
          image_url: item.products?.image_url || null,
        })),
      }));

      return NextResponse.json({
        orders: transformedOrders,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      });
    }
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
