"use client";

import { useCart } from "../context/CartContext";

export default function CartNotification() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{notification}</span>
      </div>
    </div>
  );
}
