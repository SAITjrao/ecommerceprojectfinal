"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const userResponse = await fetch("/api/me");
        if (!userResponse.ok) {
          router.push("/login");
          return;
        }
        const userData = await userResponse.json();
        if (!userData.authenticated || !userData.user) {
          router.push("/login");
          return;
        }
        setUser(userData.user);

        const ordersResponse = await fetch(
          `/api/orders?user_id=${userData.user.id}`
        );
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.orders || []);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{order.order_id}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.order_date)}
                </p>
                <p className="text-sm text-gray-500">
                  {order.items?.length || 0} items • $
                  {order.total_amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Payment: {order.payment_status}
                </p>
              </div>
              <div>
                <Link
                  href={`/orders/${order.order_id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                >
                  View Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}