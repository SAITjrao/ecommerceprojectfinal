// app/components/Header.js
"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartPage from "@/app/cart/page";

export default function Header() {
  const { cart } = useCart();
  const { wishlist, userId } = useWishlist();
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <div className="sticky top-0 z-50">
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center mx-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="border rounded px-3 py-1 mr-2"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Icons + user info */}
          <div className="flex space-x-4 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Hello, {user.fname || user.name}
                </span>
                {/* Profile Icon - Green when logged in */}
                <button
                  className="cursor-pointer bg-transparent border-none p-0"
                  onClick={() => {
                    if (user.is_admin === true || user.is_admin === "true") {
                      router.push("/dashboards/admin");
                    } else {
                      router.push("/dashboards/user");
                    }
                  }}
                  aria-label="Profile"
                >
                  <Image
                    src="/categories/login-icon.svg"
                    alt="Profile Icon"
                    className="h-7 w-7"
                    width={28}
                    height={28}
                    style={{ filter: "invert(37%) sepia(98%) saturate(749%) hue-rotate(85deg) brightness(95%) contrast(90%)" }} // Makes icon green
                  />
                </button>
              </>
            ) : (
              <button
                className="cursor-pointer bg-transparent border-none p-0"
                onClick={() => {
                  router.push("/login");
                }}
                aria-label="Login"
              >
                <Image
                  src="/categories/login-icon.svg"
                  alt="Login Icon"
                  className="h-7 w-7"
                  width={28}
                  height={28}
                />
              </button>
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

            <div className="relative cursor-pointer">
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-transparent border-none p-0 m-0"
                aria-label="Open Cart"
              >
                <Image
                  src="/categories/cart-icon.svg"
                  alt="Cart Icon"
                  className="h-7 w-7 relative cursor-pointer"
                  width={28}
                  height={28}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Side Modal */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="bg-white w-full max-w-3xl h-full shadow-lg p-8 overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <CartPage setIsCartOpen={setIsCartOpen} router={router} />
            {cart.length > 0 && (
              <div className="flex justify-center mt-4">
                <button
                  className="w-3/4 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded shadow disabled:bg-gray-400"
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/checkout");
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
