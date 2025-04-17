// app/components/Header.js
"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* Logo & Store Name */}
          <div className="flex items-center">
            <img
              src="/categories/supply-logo.jpg"
              alt="Supply Logo"
              className="h-10 w-auto mr-2"
            />
            <span className="text-2xl font-bold text-blue-500">
              Supply Store
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-500">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-500">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-500">
              Contact
            </Link>
          </nav>

          {/* Icons + user info */}
          <div className="flex space-x-4">
            {user && (
              <span className="text-sm text-gray-700 mt-2">
                Hello, {user.first_name}
              </span>
            )}
            <Link href="/login">
              <img
                src="/categories/login-icon.svg"
                alt="Login Icon"
                className="h-7 w-7"
              />
            </Link>

            <Link href="/cart" className="relative">
              <img
                src="/categories/cart-icon.svg"
                alt="Cart Icon"
                className="h-7 w-7"
              />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}