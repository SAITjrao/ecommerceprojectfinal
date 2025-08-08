"use client";
import { useState, useEffect } from "react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user ID from localStorage (or context)
  const userId = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.id : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "orders") {
          if (!userId) {
            setOrders([]);
            return;
          }
          const res = await fetch(`/api/orders?user_id=${userId}`, { credentials: "include" });
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          if (!userId) {
            setWishlist([]);
            return;
          }
          // Use your existing wishlist API
          const res = await fetch(`/api/wishlist?user_id=${userId}`, { credentials: "include" });
          const data = await res.json();
          setWishlist(data.wishlist || []);
        }
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "wishlist" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : activeTab === "orders" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <ul>
              {orders.map(order => (
                <li key={order.order_id} className="mb-2 p-2 border rounded">
                  Order #{order.order_id} - {order.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>
          {wishlist.length === 0 ? (
            <div>No wishlist items found.</div>
          ) : (
            <ul>
              {wishlist.map(item => (
                <li key={item.wishlist_id || item.id} className="mb-2 p-2 border rounded">
                  {item.name} {item.price ? `- $${item.price}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}