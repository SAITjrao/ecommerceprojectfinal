// app/components/Header.js
"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const { cart } = useCart();
  const { user, signOut, loading } = useAuth();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      alert("Logged out successfully!");
    }
  };
  return (
    <div className="">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* Logo & Store Name */}
          <div className="flex items-center">
            <Image
              src="/categories/logo.png"
              alt="Grab n Go Logo"
              className="h-10 w-auto ml-2"
              width={141}
              height={60}
            />
            <span className="text-2xl font-bold text-blue-500"></span>
          </div>

          {/* Navigation Links */}
          <nav className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-500"
            >
              Products
            </Link>
            <Link
              href="/essential-kits"
              className="text-gray-700 hover:text-blue-500"
            >
              Essential Kits
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
            {user && !loading && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hello, {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
            {!user && !loading && (
              <Link href="/login">
                <Image
                  src="/categories/login-icon.svg"
                  alt="Login Icon"
                  className="h-7 w-7"
                  width={28}
                  height={28}
                />
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Image
                src="/categories/cart-icon.svg"
                alt="Cart Icon"
                className="h-7 w-7"
                width={28}
                height={28}
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
