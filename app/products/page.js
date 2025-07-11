"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const categories = ["cutlery", "bowls", "cups", "napkins", "containers"];

export default function ProductsPage() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();
        setRecommendedProducts(data.products);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <main>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Recommended Products</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="p-6 bg-white rounded-lg shadow text-center hover:bg-gray-50"
            >
              <h2 className="font-bold">{product.name}</h2>
              <p>{product.description}</p>
              <p className="text-green-500 font-bold">${product.price}</p>
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold mt-8 mb-8">Shop by Category</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products/${category}`}
              className="p-6 bg-white rounded-lg shadow text-center hover:bg-gray-50"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
