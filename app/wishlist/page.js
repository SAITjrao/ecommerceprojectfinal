"use client";

import { useState } from "react";
import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const wishlistContext = useWishlist?.() || {};
  const {
    wishlist = [],
    loading = false,
    userId = null,
  } = wishlistContext;

  // Conditional rendering for login prompt
  if (!userId) {
    return (
      <main>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Please login to view your wishlist
            </h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to access your wishlist and save your favorite products.
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
                <ProductCard key={product.id || product.wishlist_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
