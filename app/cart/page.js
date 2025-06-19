// app/cart/page.js
"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, addToCart, updateQuantity } =
    useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleQuantityChange = (uniqueId, value) => {
    const qty = Math.max(1, Number(value));
    updateQuantity(uniqueId, qty);
  };

  const handleDiscountApply = () => {
    // Example: hardcoded discount code 'SAVE10' for 10% off
    if (discountCode === "SAVE10") {
      setAppliedDiscount(0.1);
    } else {
      setAppliedDiscount(0);
      alert("Invalid discount code");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  return (
    <main>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
            <Link href="/products">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y mb-6">
              {cart.map((item, idx) => {
                const uniqueId =
                  item.product_id || item.id || `${item.name}-${idx}`;
                return (
                  <li
                    key={uniqueId}
                    className="flex flex-col md:flex-row justify-between py-6 items-center bg-white rounded-lg shadow mb-4 p-4 gap-4"
                  >
                    <div className="flex items-center gap-4 w-full md:w-2/3">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-gray-600 text-sm">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-1/3 justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(uniqueId, item.quantity - 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-lg px-2 rounded"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(uniqueId, e.target.value)
                          }
                          className="w-16 border rounded px-2 py-1 text-center"
                        />
                        <button
                          onClick={() =>
                            handleQuantityChange(uniqueId, item.quantity + 1)
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-lg px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-lg text-blue-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(uniqueId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

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
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
              {appliedDiscount > 0 && (
                <span className="text-green-600 ml-2">Discount applied!</span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow mb-6">
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
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                >
                  Clear Cart
                </button>
                <Link href="/checkout" className="w-full">
                  <button
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
                    disabled={cart.length === 0}
                  >
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Link href="/products">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
