"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const { cart, createOrder, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      setError("Please log in to complete your order");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createOrder();

      if (result.success) {
        alert(
          `Your order has been created! Order ID: ${
            result.order_id
          }. Total: $${result.total.toFixed(2)}`
        );
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Failed to create order");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            {cart.map((item) => (
              <div
                key={item.product_id || item.id}
                className="flex justify-between py-2 border-b"
              >
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <div>${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>
                $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Login Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You need to log in to complete your purchase.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push("/login")}
                      className="bg-yellow-800 text-yellow-50 py-2 px-4 rounded hover:bg-yellow-900 text-sm font-medium"
                    >
                      Log In Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            onClick={handleCheckout}
            disabled={loading || cartLoading || cart.length === 0 || !user}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : !user ? "Please Log In to Place Order" : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
