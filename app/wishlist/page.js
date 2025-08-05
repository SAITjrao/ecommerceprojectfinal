"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import WishlistButton from "../components/WishlistButton";

export default function WishlistPage() {
  // Add fallback defaults to prevent destructuring errors
  const wishlistContext = useWishlist?.() || {};
  const {
    wishlist = [],
    loading = false,
    userId = null,
  } = wishlistContext;
  const { addToCart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, parseInt(quantity) || 1),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = selectedQuantities[product.id || product.id] || 1;
    addToCart(product, quantity);
  };

  // Conditional rendering for login prompt
  if (!userId) {
    return (
      <main>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Please login to view your wishlist
            </h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to access your wishlist and save your
              favorite products.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/products"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Start adding products to your wishlist to save them for later.
              </p>
              <Link
                href="/products"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.id || product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        product.image_url
                          ? `/products/${product.category}/${product.image_url}`
                          : "/categories/product1.jpg"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/categories/product1.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <WishlistButton product={product} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{product.category}</p>
                    <p className="text-xl font-bold text-blue-600 mb-4">
                      ${product.price}
                    </p>

                    <div className="flex items-center space-x-2 mb-4">
                      <label className="text-sm text-gray-700">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={
                          selectedQuantities[product.id || product.id] || 1
                        }
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id || product.id,
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
