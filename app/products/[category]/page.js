"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

export default function CategoryPage({ params }) {
  // Unwrap params with React.use() for Next.js 15+
  const unwrappedParams = React.use(params);
  const category = unwrappedParams.category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/${category}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    // Normalize product to always have product_id
    const normalizedProduct = {
      ...product,
      product_id: product.product_id || product.id,
    };
    const uniqueId = normalizedProduct.product_id;
    const qty = selectedQuantities[uniqueId] || 1;
    addToCart(normalizedProduct, qty);
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main>
      {/* Category Banner */}
      <section
        className="relative bg-cover bg-center h-64 mb-8"
        style={{
          backgroundImage: `url('/categories/${category}.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
          <p className="mt-2 text-lg">
            Explore our best selection of {categoryName.toLowerCase()}.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading && (
          <div className="text-center text-lg">Loading products...</div>
        )}
        {error && (
          <div className="text-center text-red-600">Error: {error}</div>
        )}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center text-gray-600">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product, idx) => {
                  const uniqueId =
                    product.product_id ||
                    product.id ||
                    `${product.name}-${idx}`;
                  return (
                    <div
                      key={uniqueId}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                    >
                      {/* Product Image */}
                      <div className="flex justify-center mb-4">
                        {product.image_url ? (
                          <Image
                            src={`/products/${category}/${product.image_url}`}
                            alt={product.name}
                            width={160}
                            height={160}
                            className="rounded bg-white border"
                            style={{ objectFit: "contain" }}
                          />
                        ) : (
                          <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-2 space-x-6">
                        <h2 className="text-xl font-semibold text-center">
                          {product.name}
                        </h2>
                        <p className="text-2xl text-gray-600 pl-10 font-bold">
                          ${product.price}
                        </p>
                      </div>
                      <div className="flex items-center mt-4 ml-2">
                        <label htmlFor={`qty-${uniqueId}`}>Qty:</label>
                        <input
                          id={`qty-${uniqueId}`}
                          type="number"
                          min="1"
                          value={selectedQuantities[uniqueId] || 1}
                          onChange={(e) =>
                            setSelectedQuantities((q) => ({
                              ...q,
                              [uniqueId]: Math.max(1, Number(e.target.value)),
                            }))
                          }
                          className="w-16 border rounded px-3 py-1 ml-2"
                        />
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-31"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
