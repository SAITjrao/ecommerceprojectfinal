"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import WishlistButton from "@/app/components/WishlistButton";

export default function CategoryPage({ params }) {
  const category = params.category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products, then filter by category client-side
        const response = await fetch(`/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        // Filter products by category
        const filteredProducts = data.data.filter(
          (product) => product.category?.toLowerCase() === category.toLowerCase()
        );
        setProducts(filteredProducts);
        // Extract unique materials from the filtered products
        const uniqueMaterials = [
          ...new Set(filteredProducts.map((product) => product.material)),
        ];
        setMaterials(uniqueMaterials);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    const normalizedProduct = {
      ...product,
      product_id: product.product_id || product.id,
    };
    const uniqueId = normalizedProduct.product_id;
    const qty = selectedQuantities[uniqueId] || 1;
    addToCart(normalizedProduct, qty);
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main>
      {/* Category Banner */}
      <section
        className="relative bg-cover bg-center h-64"
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

      <div className="px-4 pb-16">
        <div className="flex">
          {/* Left-hand sidebar */}
          <aside className="w-64 bg-white shadow rounded-lg p-6 h-fit mt-18 ml-18 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Filter & Sort</h2>
            <div className="flex flex-col gap-5">
              {/* Price Range */}
              <div>
                <label className="block font-medium mb-2">Price (up to)</label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">$0</span>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full mx-2"
                  />
                  <span className="text-gray-500">${maxPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Max: ${maxPrice}</span>
                </div>
              </div>

              {/* Sort by Material (Checkboxes) */}
              <div>
                <label className="block font-medium mb-2">Sort by Material</label>
                <div className="flex flex-col gap-2">
                  {materials.map((mat) => (
                    <label
                      key={mat}
                      className="flex items-center gap-2 hover:bg-green-50 rounded cursor-pointer px-2 py-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(mat)}
                        onChange={() => handleMaterialChange(mat)}
                        className="accent-blue-600"
                      />
                      <span>{mat.charAt(0).toUpperCase() + mat.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <div className="p-8 mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products
                  .filter(
                    (product) =>
                      product.price <= maxPrice &&
                      (selectedMaterials.length === 0 ||
                        selectedMaterials.includes(product.material))
                  )
                  .map((product, idx) => {
                    const uniqueId =
                      product.product_id ||
                      product.id ||
                      `${product.name}-${idx}`;
                    return (
                      <div
                        key={uniqueId}
                        className="bg-gray-50 rounded-lg shadow transition-transform duration-200 hover:shadow-lg hover:scale-[1.03] p-0 flex flex-col relative overflow-hidden cursor-pointer"
                        onClick={() => setModalProduct(product)}
                      >
                        {/* Wishlist Button */}
                        <div className="absolute top-4 right-4 z-10">
                          <WishlistButton product={product} />
                        </div>

                        {/* Product Image */}
                        <div className="bg-white rounded-t-lg flex items-center justify-center w-full h-60">
                          {product.image_url ? (
                            <Image
                              src={`/products/${category}/${product.image_url}`}
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
                        <div className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                          <h2 className="text-xl font-bold text-gray-800 break-words">
                            {product.name}
                          </h2>
                          <div className="flex flex-col items-end">
                            <p className="text-2xl font-extrabold text-gray-900 leading-none">
                              ${product.price}
                            </p>
                            <p className="text-base font-semibold text-gray-700 mt-2">
                              {product.quantity}/case
                            </p>
                          </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="flex justify-end items-center px-4 pb-4 mt-auto pt-2">
                          <label
                            htmlFor={`qty-${uniqueId}`}
                            className="mr-2 text-gray-700 font-medium"
                          >
                            Qty:
                          </label>
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
                            className="w-16 border rounded px-3 py-1 mr-2"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Product Modal */}
            {modalProduct && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
                onClick={() => setModalProduct(null)}
              >
                <div
                  className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => setModalProduct(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center">
                    {modalProduct.image_url ? (
                      <Image
                        src={`/products/${category}/${modalProduct.image_url}`}
                        alt={modalProduct.name}
                        width={200}
                        height={200}
                        className="object-contain w-40 h-40 mb-4"
                      />
                    ) : (
                      <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center mb-4">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {modalProduct.name}
                    </h2>
                    <input
                      type="text"
                      value={modalProduct.description || ""}
                      readOnly
                      className="w-full bg-gray-100 rounded px-3 py-2 text-gray-700 text-sm mb-2"
                      placeholder="Product description"
                    />
                    <p className="text-md text-gray-600 mb-2">
                      Material: {modalProduct.material}
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900 mb-2">
                      ${modalProduct.price}
                    </p>
                    <div className="flex items-center mt-2">
                      <label
                        htmlFor={`modal-qty-${modalProduct.id}`}
                        className="mr-2 text-gray-700 font-medium"
                      >
                        Qty:
                      </label>
                      <input
                        id={`modal-qty-${modalProduct.id}`}
                        type="number"
                        min="1"
                        value={selectedQuantities[modalProduct.id] || 1}
                        onChange={(e) =>
                          setSelectedQuantities((q) => ({
                            ...q,
                            [modalProduct.id]: Math.max(1, Number(e.target.value)),
                          }))
                        }
                        className="w-16 border rounded px-3 py-1 mr-2"
                      />
                      <button
                        onClick={() => {
                          handleAddToCart(modalProduct);
                          setModalProduct(null);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
