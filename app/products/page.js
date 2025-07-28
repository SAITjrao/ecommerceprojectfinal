"use client";

import Link from "next/link";
import { fetchProducts } from "@/lib/fetchAllProducts";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client
import { useAuth } from "../context/AuthContext"; // Import authentication context

const categories = ["cutlery", "bowls", "cups", "napkins", "containers"];

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [preferences, setPreferences] = useState([]); // Add state for preferences
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const { addToCart, cart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [kits, setKits] = useState([]);
  const [newKitName, setNewKitName] = useState("");
  const [kitProducts, setKitProducts] = useState({});

  const { user, loading: authLoading } = useAuth(); // Get the user object from the authentication context

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user || !user.id) {
        console.log("User not logged in, showing all products");
        setPreferences([]); // Fallback to show all products
        return;
      }

      try {
        const { data: userPrefs, error } = await supabase
          .from("user_preferences")
          .select("preferred_categories")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.log("No user preferences found, showing all products");
          setPreferences([]); // Fallback to show all products
          return;
        }

        setPreferences(userPrefs.preferred_categories || []);
        console.log("Preferences:", userPrefs.preferred_categories);
      } catch (err) {
        console.error("Error fetching preferences:", err);
        setPreferences([]); // Fallback to show all products
      }
    };

    if (!authLoading) {
      fetchPreferences();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        // Try to fetch from Supabase first
        try {
          const { data, count } = await fetchProducts(page, pageSize);

          // Filter products based on preferences or show all if preferences are empty
          const filteredProducts =
            preferences.length > 0
              ? data.filter((product) => preferences.includes(product.category))
              : data;

          setProducts(filteredProducts);
          setTotalProducts(filteredProducts.length);
        } catch (supabaseError) {
          console.log(
            "Supabase products not available, using sample products:",
            supabaseError
          );

          // Fallback sample products for testing cart
          const sampleProducts = [
            {
              id: 1,
              product_id: 1,
              name: "Plastic Fork Set",
              price: 5.99,
              category: "cutlery",
              description: "Set of 50 plastic forks",
              stock: 100,
            },
            {
              id: 2,
              product_id: 2,
              name: "Paper Bowl Large",
              price: 8.99,
              category: "bowls",
              description: "Large disposable paper bowls",
              stock: 75,
            },
            {
              id: 3,
              product_id: 3,
              name: "Coffee Cup 12oz",
              price: 12.99,
              category: "cups",
              description: "Insulated coffee cups",
              stock: 50,
            },
            {
              id: 4,
              product_id: 4,
              name: "Dinner Napkins",
              price: 3.99,
              category: "napkins",
              description: "Premium dinner napkins",
              stock: 200,
            },
            {
              id: 5,
              product_id: 5,
              name: "Food Container Set",
              price: 15.99,
              category: "containers",
              description: "Reusable food containers",
              stock: 30,
            },
          ];

          // Filter sample products based on preferences
          const filteredSampleProducts =
            preferences.length > 0
              ? sampleProducts.filter((product) =>
                  preferences.includes(product.category)
                )
              : sampleProducts;

          setProducts(filteredSampleProducts);
          setTotalProducts(filteredSampleProducts.length);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [page, pageSize, preferences]);

  useEffect(() => {
    const fetchKits = async () => {
      if (!user || !user.id) {
        console.log("User is not logged in, skipping kits fetch.");
        return;
      }

      try {
        const { data: kits, error } = await supabase
          .from("kits")
          .select("*")
          .eq("auth_user_id", user.id); // Use auth_user_id to link with Supabase auth

        if (error) {
          console.log("No kits found for user:", error);
          return;
        }

        setKits(kits || []);
      } catch (err) {
        console.error("Error fetching kits:", err);
      }
    };

    if (user && !authLoading) {
      fetchKits();
    }
  }, [user, authLoading]);

  const handleAddToCart = (product) => {
    const normalizedProduct = {
      ...product,
      product_id: product.product_id || product.id,
    };
    const uniqueId = normalizedProduct.product_id;
    const qty = selectedQuantities[uniqueId] || 1;
    addToCart(normalizedProduct, qty);
    alert(`Added ${qty} × ${normalizedProduct.name} to Cart`);
  };

  const handleSaveKit = async () => {
    if (!user || !user.id) {
      console.error("User is not logged in or missing ID.");
      alert("You must be logged in to save a kit.");
      return;
    }

    if (!newKitName.trim()) {
      alert("Please enter a kit name.");
      return;
    }

    if (Object.keys(kitProducts).length === 0) {
      alert("Please add products to the kit before saving.");
      return;
    }

    try {
      const { error } = await supabase.from("kits").insert({
        auth_user_id: user.id, // Use auth_user_id to link with Supabase auth
        kit_name: newKitName,
        products: Object.keys(kitProducts),
        quantities: Object.values(kitProducts),
      });

      if (error) {
        throw new Error("Failed to save kit.");
      }

      setKits((prev) => [
        ...prev,
        {
          kit_name: newKitName,
          products: Object.keys(kitProducts),
          quantities: Object.values(kitProducts),
        },
      ]);
      setNewKitName("");
      setKitProducts({});
      alert("Kit saved successfully!");
    } catch (err) {
      console.error("Error saving kit:", err);
      alert("Failed to save kit. Please try again.");
    }
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

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
          {products.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product, idx) => {
                const uniqueId =
                  product.product_id || product.id || `${product.name}-${idx}`;
                return (
                  <div
                    key={uniqueId}
                    className="bg-gray-50 rounded-lg shadow hover:shadow-md transition p-6 flex flex-col"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 mb-4">${product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
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
                        className="w-16 border rounded px-2 py-1"
                      />
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.category || "all"}`}
                      className="mt-auto text-blue-500 hover:underline"
                    >
                      View Category
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Essential Kits Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Essential Kits</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Kit Name"
              value={newKitName}
              onChange={(e) => setNewKitName(e.target.value)}
              className="border rounded px-2 py-1 mr-2"
            />
            <button
              onClick={handleSaveKit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Kit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {kits.map((kit) => (
              <div key={kit.id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold mb-2">{kit.kit_name}</h3>
                <ul>
                  {kit.products &&
                    kit.quantities &&
                    kit.products.map((product, idx) => (
                      <li key={idx}>
                        {product} - Qty: {kit.quantities[idx] || 0}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
