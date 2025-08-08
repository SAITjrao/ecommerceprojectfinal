"use client";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const uniqueId = product.id || `${product.name}-${product.category}`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} × ${product.name} to Cart`);
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow transition-transform duration-200 hover:shadow-lg hover:scale-[1.03] p-0 flex flex-col relative overflow-hidden cursor-pointer">
      {/* Wishlist Button */}
      <div className="absolute top-4 right-4 z-10">
        <WishlistButton product={product} />
      </div>

      {/* Product Image */}
      <div className="bg-white rounded-t-lg flex items-center justify-center w-full h-60">
        {product.image_url ? (
          <Image
            src={`/products/${product.category}/${product.image_url}`}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center aspect-square">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Product Name, Price, and Quantity */}
      <div className="flex flex-row items-center justify-between px-6 pt-4 pb-2">
        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
        <div className="flex flex-col items-end">
          <p className="text-3xl font-extrabold text-gray-900 leading-none">${product.price}</p>
          <p className="text-lg font-semibold text-gray-700 mt-2">{product.quantity}/case</p>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="flex justify-end items-center px-6 pb-4 mt-auto pt-2">
        <label htmlFor={`qty-${uniqueId}`} className="mr-2 text-gray-700 font-medium">
          Qty:
        </label>
        <input
          id={`qty-${uniqueId}`}
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-16 border rounded px-3 py-1 mr-2"
        />
        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}