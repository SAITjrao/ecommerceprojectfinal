// app/cart/page.js
"use client";
import { useCart } from "@/app/context/CartContext"; 
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y mb-6">
              {cart.map((item) => (
                <li key={item.product_id} className="flex justify-between py-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-xl font-semibold mb-4">
              Total: ${total.toFixed(2)}
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                <Link href="/checkout">Checkout</Link>
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
