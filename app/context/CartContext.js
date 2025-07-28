// app/context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();
  const isInitialized = useRef(false);

  // Initialize cart when user changes
  useEffect(() => {
    if (user && !isInitialized.current) {
      initializeCart();
      isInitialized.current = true;
    } else if (!user && isInitialized.current) {
      // User logged out, clear cart
      setCart([]);
      setCartId(null);
      isInitialized.current = false;
    }
  }, [user]);

  // Initialize cart from Supabase or create new one
  const initializeCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if user has an existing cart
      const { data: existingCarts, error: cartError } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);

      let currentCartId;

      if (cartError) throw cartError;

      if (existingCarts && existingCarts.length > 0) {
        // Use existing cart
        currentCartId = existingCarts[0].id;
        setCartId(currentCartId);
      } else {
        // Create new cart
        const { data: newCart, error: createError } = await supabase
          .from("carts")
          .insert([
            {
              user_id: user.id,
              status: "active",
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) throw createError;

        currentCartId = newCart.id;
        setCartId(currentCartId);
      }

      // Load cart items
      await loadCartItems(currentCartId);
    } catch (error) {
      console.error("Error initializing cart:", error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load cart items from Supabase
  const loadCartItems = async (cartId) => {
    try {
      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          products (*)
        `
        )
        .eq("cart_id", cartId);

      if (error) throw error;

      const formattedItems = cartItems.map((item) => ({
        ...item.products,
        cart_item_id: item.id,
        quantity: item.quantity,
      }));

      setCart(formattedItems);
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  // Fallback to localStorage
  const loadFromLocalStorage = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  };

  // Save to localStorage as backup
  useEffect(() => {
    if (cart.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Add product to cart or update quantity if already exists
  const addToCart = async (product, quantity = 1) => {
    console.log("Adding to cart:", product, "quantity:", quantity);
    console.log("User authenticated:", !!user, "Cart ID:", cartId);
    
    // Always add to local cart first for immediate UI feedback
    setCart((prevCart) => {
      const uniqueId = product.product_id || product.id;
      const index = prevCart.findIndex(
        (item) => (item.product_id || item.id) === uniqueId
      );
      if (index !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[index] = {
          ...updatedCart[index],
          quantity: updatedCart[index].quantity + quantity,
        };
        console.log("Updated existing item in cart");
        return updatedCart;
      } else {
        console.log("Added new item to cart");
        return [...prevCart, { ...product, quantity }];
      }
    });

    // Show notification
    setNotification("Item added to cart");
    setTimeout(() => setNotification(null), 3000);

    // If user is authenticated, also sync to database
    if (!user || !cartId) {
      console.log("User not authenticated, item stored locally only");
      return;
    }

    // Sync to database for authenticated users
    setLoading(true);
    try {
      const productId = product.product_id || product.id;

      // Check if item already exists in database
      const { data: existingItems, error: fetchError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartId)
        .eq("product_id", productId);

      if (fetchError) throw fetchError;

      if (existingItems && existingItems.length > 0) {
        // Update existing item in database
        const existingItem = existingItems[0];
        const newQuantity = existingItem.quantity + quantity;

        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id);

        if (error) throw error;
        console.log("Updated item in database");
      } else {
        // Add new item to database
        const { error } = await supabase
          .from("cart_items")
          .insert([
            {
              cart_id: cartId,
              product_id: productId,
              quantity: quantity,
            },
          ]);

        if (error) throw error;
        console.log("Added new item to database");
      }
    } catch (error) {
      console.error("Error syncing to database:", error);
      // Cart is already updated locally, so this is just a sync issue
    } finally {
      setLoading(false);
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    if (!user || !cartId) {
      console.error("User not authenticated or cart not initialized");
      return;
    }

    setLoading(true);
    try {
      const item = cart.find(
        (item) => (item.product_id || item.id) === productId
      );
      if (!item) return;

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", item.cart_item_id);

      if (error) throw error;

      setCart((prev) =>
        prev.filter((item) => (item.product_id || item.id) !== productId)
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
      // Fallback to localStorage
      setCart((prevCart) =>
        prevCart.filter((item) => (item.product_id || item.id) !== productId)
      );
    } finally {
      setLoading(false);
    }
  };

  // Update quantity for a product
  const updateQuantity = async (productId, quantity) => {
    if (!user || !cartId) {
      console.error("User not authenticated or cart not initialized");
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setLoading(true);
    try {
      const item = cart.find(
        (item) => (item.product_id || item.id) === productId
      );
      if (!item) return;

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", item.cart_item_id);

      if (error) throw error;

      setCart((prev) =>
        prev.map((item) =>
          (item.product_id || item.id) === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Fallback to localStorage
      setCart((prevCart) =>
        prevCart.map((item) =>
          (item.product_id || item.id) === productId
            ? { ...item, quantity }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear the cart
  const clearCart = async () => {
    if (!user || !cartId) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

      if (error) throw error;

      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Create order from cart
  const createOrder = async () => {
    if (!user || !cartId || cart.length === 0) {
      throw new Error("Cart is empty or user not authenticated");
    }

    setLoading(true);
    try {
      // Calculate total
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_amount: total,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id || item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Mark cart as completed and clear it
      await supabase
        .from("carts")
        .update({ status: "completed" })
        .eq("id", cartId);

      // Clear local cart
      setCart([]);
      setCartId(null);

      // Initialize new cart for user
      await initializeCart();

      return {
        success: true,
        order_id: order.id,
        total: total,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        createOrder,
        cartId,
        loading,
        initializeCart,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
