"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import OrdersList from "@/app/orders/OrdersList";
import ProductCard from "@/app/components/ProductCard";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();

  // Get user ID from localStorage (or context)
  const userId = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.id : null;

  // Only fetch wishlist when tab is "wishlist"
  useEffect(() => {
    if (activeTab === "wishlist" && userId) {
      setLoading(true);
      fetch(`/api/wishlist?user_id=${userId}`, { credentials: "include" })
        .then(res => res.json())
        .then(data => setWishlist(data.wishlist || []))
        .finally(() => setLoading(false));
    }
  }, [activeTab, userId]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      clearCart();
      clearWishlist();
      localStorage.removeItem("user");
      window.location.replace("/login");
    } catch (err) {
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          disabled={logoutLoading}
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
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
      {activeTab === "orders" ? (
        <OrdersList />
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>
          {wishlist.length === 0 ? (
            <div>No wishlist items found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {wishlist.map(item => (
                <ProductCard key={item.wishlist_id || item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}