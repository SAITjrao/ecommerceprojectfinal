"use client";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";

export default function WishlistButton({ product, className = "" }) {
  const { isInWishlist, toggleWishlist, loading, userId } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);

  const productId = product.id || product.id;
  const inWishlist = isInWishlist(productId);

  const showToast = (message, type = "success") => {
    // Simple toast implementation
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleToggle = async () => {
    if (isToggling || loading) return;
    if (!userId) {
      showToast("Please login to manage your wishlist", "error");
      return;
    }
    setIsToggling(true);
    try {
      const result = await toggleWishlist(product);
      if (result.success) {
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      showToast("Failed to update wishlist", "error");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling || loading}
      className={`wishlist-button ${className} ${
        inWishlist ? "text-yellow-500" : "text-gray-400"
      } hover:text-yellow-500 transition-colors duration-200 disabled:opacity-50 cursor-pointer`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className="w-6 h-6"
        fill={inWishlist ? "currentColor" : "none"}
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
    </button>
  );
}
