"use client";

import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/fetchAllProducts";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import WishlistButton from "../components/WishlistButton";

const categories = ["cutlery", "bowls", "cups", "napkins", "plates"];

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const { addToCart, cart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data, count } = await fetchProducts(page, pageSize);
        setProducts(data);
        setTotalProducts(count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const handleAddToCart = (product) => {
    const normalizedProduct = {
      ...product,
      id: product.id || product.id,
    };
    const uniqueId = normalizedProduct.id;
    const qty = selectedQuantities[uniqueId] || 1;
    addToCart(normalizedProduct, qty);
    alert(`Added ${qty} × ${normalizedProduct.name} to Cart`);
  };

  // Dynamically get unique materials from products
  const materials = Array.from(
    new Set(products.map((product) => product.material).filter(Boolean))
  );

  // Checkbox handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const handleMaterialChange = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat)
        ? prev.filter((m) => m !== mat)
        : [...prev, mat]
    );
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.price <= maxPrice &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)) &&
        (selectedMaterials.length === 0 ||
          selectedMaterials.includes(product.material))
    )
    .sort((a, b) => a.price - b.price);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <main>
      <div className="flex">
        {/* Left-hand sidebar */}
        <aside className="w-64 bg-white shadow rounded-lg p-6 mr-8 h-fit mt-25 ml-10 sticky top-32">
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

            {/* Sort by Category (Checkboxes) */}
            <div>
              <label className="block font-medium mb-2">Sort by Category</label>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 hover:bg-green-50 rounded cursor-pointer px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="accent-blue-600"
                    />
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort by Material (Checkboxes) */}
            <div>
              <label className="block font-medium mb-2">Sort by Material</label>
              <div className="flex flex-col gap-2">
                {materials.map((mat) => (
                  <label key={mat} className="flex items-center gap-2 hover:bg-green-50 rounded cursor-pointer px-2 py-1">
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
        {/* Main content */}
        <div className="flex-1">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <label htmlFor="pageSize" className="mr-2 font-medium">
                  Show:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1); // Reset to first page on page size change
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ml-2">products per page</span>
              </div>
              <div>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white shadow rounded-lg overflow-hidden p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  No products found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {filteredProducts.map((product, idx) => {
                    const uniqueId = product.id || product.id || `${product.name}-${idx}`;
                    return (
                      <div
                        key={uniqueId}
                        className="bg-gray-50 rounded-lg shadow transition-transform duration-200 hover:shadow-lg hover:scale-[1.03] p-0 flex flex-col relative overflow-hidden cursor-pointer"
                        onClick={e => {
                          // Only open modal if click is NOT on the wishlist button
                          if (!e.target.closest('.wishlist-btn')) {
                            setModalProduct(product);
                          }
                        }}
                      >
                        {/* Wishlist Button */}
                        <div className="absolute top-4 right-4 z-10">
                          <WishlistButton product={product} className="wishlist-btn" />
                        </div>

                        {/* Product Image*/}
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
                            value={selectedQuantities[uniqueId] || 1}
                            onChange={(e) =>
                              setSelectedQuantities((q) => ({
                                ...q,
                                [uniqueId]: Math.max(1, Number(e.target.value)),
                              }))
                            }
                            className="w-16 border rounded px-3 py-1 mr-2"
                            onClick={e => e.stopPropagation()}
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
              )}
            </div>
          </div>
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
            onClick={e => e.stopPropagation()}
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
                  src={`/products/${modalProduct.category}/${modalProduct.image_url}`}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{modalProduct.name}</h2>
              <input
                type="text"
                value={modalProduct.description || ""}
                readOnly
                className="w-full bg-gray-100 rounded px-3 py-2 text-gray-700 text-sm mb-2"
                placeholder="Product description"
              />
              <p className="text-md text-gray-600 mb-2">Material: {modalProduct.material}</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-2">${modalProduct.price}</p>
              <div className="flex items-center mt-2">
                <label htmlFor={`modal-qty-${modalProduct.id}`} className="mr-2 text-gray-700 font-medium">
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
    </main>
  );
}
