import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "month";
  let fromDate;

  const now = new Date();
  if (range === "week") {
    fromDate = new Date(now);
    fromDate.setDate(now.getDate() - 7);
  } else if (range === "month") {
    fromDate = new Date(now);
    fromDate.setMonth(now.getMonth() - 1);
  } else if (range === "year") {
    fromDate = new Date(now);
    fromDate.setFullYear(now.getFullYear() - 1);
  } else {
    fromDate = new Date(2000, 0, 1); // all time
  }

  // Format date for Supabase
  const isoFromDate = fromDate.toISOString();

  // Get orders from database
  const { data, error } = await supabase
    .from("orders")
    .select("order_date,total_amount")
    .gte("order_date", isoFromDate);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // Aggregate sales by day
  const salesByDay = {};
  data.forEach(order => {
    const day = order.order_date.slice(0, 10); // YYYY-MM-DD
    if (!salesByDay[day]) {
      salesByDay[day] = { count: 0, total: 0 };
    }
    salesByDay[day].count += 1;
    salesByDay[day].total += order.total_amount || 0;
  });

  // Prepare chart data sorted by date
  const chartData = Object.entries(salesByDay)
    .map(([date, { count, total }]) => ({
      date,
      count,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return NextResponse.json({ data: chartData });
}