"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTrashAlt } from "react-icons/fa";

export default function CartPage({ setIsCartOpen, router }) {
  const { cart, removeFromCart, clearCart, addToCart, updateQuantity, discountCode, setDiscountCode, appliedDiscount, setAppliedDiscount } = useCart();

  const handleQuantityChange = (uniqueId, value) => {
    const qty = Math.max(1, Number(value));
    updateQuantity(uniqueId, qty);
  };

  const handleDiscountApply = () => {
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
  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  return (
    <main>
      <style jsx>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Cart</h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
              onClick={() => {
                if (setIsCartOpen) setIsCartOpen(false);
                if (router) router.push("/products");
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="mb-6 space-y-6">
              {cart.map((item, idx) => {
                const uniqueId = item.id || `${item.name}-${idx}`;
                return (
                  <li
                    key={uniqueId}
                    className="relative flex flex-col md:flex-row bg-white rounded-lg shadow p-6 gap-6 items-center"
                  >
                    {/* Trash icon in top right */}
                    <button
                      onClick={() => removeFromCart(uniqueId)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition text-base"
                      aria-label="Remove from cart"
                    >
                      <FaTrashAlt />
                    </button>
                    {/* Larger product image */}
                    <div className="w-24 h-24 bg-white rounded flex items-center justify-center overflow-hidden border mr-6">
                      {item.image_url ? (
                        <Image
                          src={`/products/${item.category || "all"}/${item.image_url}`}
                          alt={item.name}
                          width={128}
                          height={128}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    {/* Product info and controls */}
                    <div className="flex-1 flex flex-col mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-lg pr-4">{item.name}</p>
                        <span className="font-semibold text-xl">${item.price}</span>
                      </div>
                      {item.quantityPerCase && (
                        <div className="text-gray-500 text-sm mb-2">
                          {item.quantityPerCase} per case
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(uniqueId, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-lg px-3 rounded"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(uniqueId, e.target.value)}
                            className="w-16 border rounded px-2 py-1 text-center"
                          />
                          <button
                            onClick={() => handleQuantityChange(uniqueId, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-lg px-3 rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="mt-2 font-semibold text-lg">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
              {appliedDiscount > 0 && (
                <span className="text-green-600 ml-2">Discount applied!</span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow">
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
              <div className="flex justify-between text-lg mb-4">
                <span>Tax (5%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
