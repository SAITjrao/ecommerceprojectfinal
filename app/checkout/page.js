"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, clearCart, discountCode, setDiscountCode, appliedDiscount, setAppliedDiscount } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  // const [discountCode, setDiscountCode] = useState("");
  // const [appliedDiscount, setAppliedDiscount] = useState(0);
  const router = useRouter();

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            // If not authenticated, redirect to login
            router.push("/login");
          }
        } else {
          // If not authenticated, redirect to login
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Discount logic
  const handleDiscountApply = () => {
    if (discountCode === "SAVE10") {
      setAppliedDiscount(0.1);
    } else {
      setAppliedDiscount(0);
      alert("Invalid discount code");
    }
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * appliedDiscount;
  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if user is authenticated
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if cart has items
      if (!cart || cart.length === 0) {
        setError("Your cart is empty");
        return;
      }

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          items: cart,
          total_amount: total,
          discount: discountAmount,
          tax: taxAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Clear cart
      clearCart();

      // Show success message and redirect
      alert(`Order created successfully! Order ID: ${data.order_id}`);
      router.push(`/orders/${data.order_id}`);
    } catch (err) {
      setError(err.message);
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to checkout.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            {cart.map((item) => (
              <div
                key={item.id || item.name}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden border">
                    {item.image_url ? (
                      <Image
                        src={`/products/${item.category || "all"}/${item.image_url}`}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
                <div>${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mb-4 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={handleDiscountApply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Apply
            </button>
            {appliedDiscount > 0 && (
              <span className="text-green-600 ml-2">Discount applied!</span>
            )}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-lg mb-2 text-green-600">
                <span>Discount:</span>
                <span>- ${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg mb-2">
              <span>Tax (5%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </>
      )}
    </div>
  );
}
