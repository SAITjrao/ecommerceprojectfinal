"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const EssentialKitsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [customKitName, setCustomKitName] = useState("");
  const [savedKits, setSavedKits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [kitsLoadError, setKitsLoadError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Pre-defined kit templates
  const preDefinedKits = [
    {
      id: "starter",
      name: "Restaurant Starter Kit",
      items: [
        {
          name: "Plastic Fork Set",
          price: 5.99,
          category: "cutlery",
          quantity: 2,
        },
        {
          name: "Paper Bowl Large",
          price: 8.99,
          category: "bowls",
          quantity: 3,
        },
        { name: "Plastic Cup 16oz", price: 4.5, category: "cups", quantity: 5 },
        {
          name: "Paper Napkins",
          price: 3.25,
          category: "napkins",
          quantity: 4,
        },
      ],
      description: "Essential items to get your restaurant started",
    },
    {
      id: "premium",
      name: "Premium Dining Kit",
      items: [
        {
          name: "Plastic Fork Set",
          price: 5.99,
          category: "cutlery",
          quantity: 3,
        },
        {
          name: "Paper Bowl Large",
          price: 8.99,
          category: "bowls",
          quantity: 4,
        },
        { name: "Plastic Cup 16oz", price: 4.5, category: "cups", quantity: 6 },
        {
          name: "Paper Napkins",
          price: 3.25,
          category: "napkins",
          quantity: 6,
        },
        {
          name: "Food Containers",
          price: 12.99,
          category: "containers",
          quantity: 2,
        },
      ],
      description: "Complete dining experience with takeout containers",
    },
    {
      id: "takeout",
      name: "Takeout Specialist Kit",
      items: [
        {
          name: "Food Containers",
          price: 12.99,
          category: "containers",
          quantity: 10,
        },
        {
          name: "Plastic Fork Set",
          price: 5.99,
          category: "cutlery",
          quantity: 5,
        },
        {
          name: "Paper Napkins",
          price: 3.25,
          category: "napkins",
          quantity: 8,
        },
      ],
      description: "Perfect for takeout and delivery focused restaurants",
    },
  ];

  // Sample products for custom kit creation
  useEffect(() => {
    const sampleProducts = [
      { id: 1, name: "Plastic Fork Set", price: 5.99, category: "cutlery" },
      { id: 2, name: "Paper Bowl Large", price: 8.99, category: "bowls" },
      { id: 3, name: "Plastic Cup 16oz", price: 4.5, category: "cups" },
      { id: 4, name: "Paper Napkins", price: 3.25, category: "napkins" },
      { id: 5, name: "Food Containers", price: 12.99, category: "containers" },
    ];
    setAvailableProducts(sampleProducts);
  }, []);

  // Load saved kits for user
  useEffect(() => {
    if (user && user.id) {
      console.log("Loading saved kits for user:", user.id);
      loadSavedKits();
    }
  }, [user]);

  const loadSavedKits = async () => {
    if (!user || !user.id) {
      console.log("No user or user ID available for loading kits");
      return;
    }

    console.log("Attempting to load saved kits for user:", user.id);
    try {
      setKitsLoadError(null); // Clear any previous error
      // First check if the kits table exists by trying a simple query
      const { data, error } = await supabase
        .from("kits")
        .select("*")
        .eq("user_id", user.id)
        .limit(10);

      if (error) {
        console.error("Supabase error loading saved kits:", error);
        if (error.code === "42P01") {
          const errorMsg =
            "Kits table does not exist. Please run the database schema setup.";
          console.log(errorMsg);
          setKitsLoadError(errorMsg);
        } else {
          setKitsLoadError(`Database error: ${error.message}`);
        }
        throw error;
      }

      console.log("Successfully loaded kits:", data);
      setSavedKits(data || []);
    } catch (error) {
      console.error("Error loading saved kits:", error.message || error);
      if (!kitsLoadError) {
        setKitsLoadError(error.message || "Unknown error loading saved kits");
      }
      // Don't throw error to prevent component crash, just set empty array
      setSavedKits([]);
    }
  };

  const handleAddPreDefinedKitToCart = async (kit) => {
    try {
      console.log("Adding pre-defined kit to cart:", kit);
      
      // Add each item in the kit to cart
      for (const item of kit.items) {
        const productData = {
          ...item,
          product_id: `kit-${kit.id}-${item.name
            .replace(/\s+/g, "-")
            .toLowerCase()}`,
          id: `kit-${kit.id}-${item.name.replace(/\s+/g, "-").toLowerCase()}`,
        };
        await addToCart(productData, item.quantity);
      }

      const totalItems = kit.items.reduce((sum, item) => sum + item.quantity, 0);
      console.log(`Successfully added ${kit.name} to cart (${totalItems} items)`);
      alert(`${kit.name} added to cart! (${totalItems} items)`);
    } catch (error) {
      console.error("Error adding kit to cart:", error);
      alert("Error adding kit to cart. Please try again.");
    }
  };

  const handleProductSelection = (product, quantity) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => ({
        ...prev,
        [product.id]: { ...product, quantity },
      }));
    } else {
      setSelectedProducts((prev) => {
        const newSelected = { ...prev };
        delete newSelected[product.id];
        return newSelected;
      });
    }
  };

  const handleSaveCustomKit = async () => {
    if (!user) {
      alert("Please log in to save custom kits");
      return;
    }

    if (!customKitName.trim()) {
      alert("Please enter a kit name");
      return;
    }

    if (Object.keys(selectedProducts).length === 0) {
      alert("Please select at least one product");
      return;
    }

    setLoading(true);
    try {
      setKitsLoadError(null); // Clear any previous error
      const kitData = {
        user_id: user.id,
        kit_name: customKitName,
        products: Object.values(selectedProducts),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("kits").insert([kitData]);

      if (error) {
        console.error("Supabase error saving kit:", error);
        throw error;
      }

      alert("Custom kit saved successfully!");
      setCustomKitName("");
      setSelectedProducts({});
      loadSavedKits();
    } catch (error) {
      console.error("Error saving kit:", error.message || error);
      alert(
        `Failed to save kit: ${
          error.message || "Unknown error"
        }. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomKitToCart = (products) => {
    products.forEach((product) => {
      addToCart(product, product.quantity);
    });

    const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
    alert(`Custom kit added to cart! (${totalItems} items)`);
  };

  const calculateKitTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Essential Kits Configurator
          </h1>
          <p className="text-lg text-gray-600">
            Create custom product bundles or choose from our pre-designed kits
          </p>
        </div>

        {!user && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">Authentication Required</p>
            <p>
              Please{" "}
              <Link href="/login" className="underline text-blue-600">
                log in
              </Link>{" "}
              to save custom kits and access your saved kits.
            </p>
          </div>
        )}

        {/* Pre-defined Kits Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pre-Designed Kits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preDefinedKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {kit.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{kit.description}</p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {kit.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-800">
                      Total: ${calculateKitTotal(kit.items).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddPreDefinedKitToCart(kit)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Add Kit to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Kit Builder */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Create Custom Kit
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kit Name
              </label>
              <input
                type="text"
                value={customKitName}
                onChange={(e) => setCustomKitName(e.target.value)}
                placeholder="Enter kit name (e.g., 'My Restaurant Essentials')"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Select Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.category}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <label className="text-sm font-medium text-gray-700">
                        Quantity:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={selectedProducts[product.id]?.quantity || 0}
                        onChange={(e) =>
                          handleProductSelection(
                            product,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(selectedProducts).length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Products
                </h3>
                <div className="space-y-2">
                  {Object.values(selectedProducts).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {product.name} × {product.quantity}
                      </span>
                      <span className="font-medium">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>
                      $
                      {Object.values(selectedProducts)
                        .reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSaveCustomKit}
                disabled={
                  loading || !user || Object.keys(selectedProducts).length === 0
                }
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded transition-colors"
              >
                {loading ? "Saving..." : "Save Custom Kit"}
              </button>
              <button
                onClick={() =>
                  handleAddCustomKitToCart(Object.values(selectedProducts))
                }
                disabled={Object.keys(selectedProducts).length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        {/* Saved Kits Section */}
        {user && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Saved Kits
            </h2>

            {kitsLoadError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p className="font-bold">Error Loading Saved Kits</p>
                <p>{kitsLoadError}</p>
                <p className="text-sm mt-2">
                  Check the browser console for more details. You may need to
                  set up the database schema.
                </p>
              </div>
            )}

            {!kitsLoadError && savedKits.length === 0 && (
              <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
                <p>
                  No saved kits yet. Create and save custom kits to see them
                  here!
                </p>
              </div>
            )}

            {!kitsLoadError && savedKits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedKits.map((kit) => (
                  <div
                    key={kit.id}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {kit.kit_name}
                    </h3>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        Products:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {kit.products &&
                          kit.products.map((product, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{product.name}</span>
                              <span className="font-medium">
                                ×{product.quantity}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleAddCustomKitToCart(kit.products)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors">
              Browse All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EssentialKitsPage;
