// app/components/Header.js
"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cart } = useCart();
  const { wishlist, userId } = useWishlist();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

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

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div className="">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* Logo & Store Name */}
          <div className="flex items-center mt-1">
            <Link href="/">
              <Image
                src="/categories/logo.png"
                alt="Grab n Go Logo"
                className="h-10 w-auto"
                width={160}
                height={68}
                style={{ height: "68px", width: "160px", objectFit: "contain", cursor: "pointer" }}
              />
            </Link>
            <span className="text-2xl font-bold text-blue-500"></span>
          </div>

          {/* Navigation Links */}
          <nav className="space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-500 cursor-pointer"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-500 cursor-pointer"
            >
              Products
            </Link>
            {user && (
              <Link
                href="/orders"
                className="text-gray-700 hover:text-blue-500 cursor-pointer"
              >
                Orders
              </Link>
            )}
            {user && user.is_admin && (
              <Link
                href="/dashboards/admin"
                className="text-gray-700 hover:text-blue-500 cursor-pointer font-medium"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-500 cursor-pointer"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-500 cursor-pointer"
            >
              Contact
            </Link>
          </nav>

          {/* Icons + user info */}
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hello, {user.fname || user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="cursor-pointer">
                <Image
                  src="/categories/login-icon.svg"
                  alt="Login Icon"
                  className="h-7 w-7"
                  width={28}
                  height={28}
                />
              </Link>
            )}

            {/* Wishlist Icon - Only show if user is logged in */}
            {userId && (
              <Link href="/wishlist" className="relative cursor-pointer">
                <svg
                  className="h-7 w-7 text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <Link href="/cart" className="relative cursor-pointer">
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
