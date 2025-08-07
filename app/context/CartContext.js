// app/context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const isFirstLoad = useRef(true);

  // Load cart and cartId from localStorage if they exist
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    const savedCartId = localStorage.getItem("cart_id");
    if (savedCartId) setCartId(savedCartId);
  }, []);

  // Save cart and cartId to localStorage whenever they change
  useEffect(() => {
    if (cart.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  useEffect(() => {
    if (cartId) {
      localStorage.setItem("cart_id", cartId);
    }
  }, [cartId]);

  // Create cart in backend if not exists
  useEffect(() => {
    if (!cartId && isFirstLoad.current) {
      isFirstLoad.current = false;
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1 }), // Replace with actual user id if available
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart && data.cart.id) setCartId(data.cart.id.toString());
        });
    }
  }, [cartId]);

  // Add product to cart or update quantity if already exists
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const uniqueId = product.product_id || product.id;
      // Find the index of the existing product
      const index = prevCart.findIndex(
        (item) => (item.product_id || item.id) === uniqueId
      );
      if (index !== -1) {
        // Add the new quantity to the existing quantity
        const updatedCart = [...prevCart];
        updatedCart[index] = {
          ...updatedCart[index],
          quantity: updatedCart[index].quantity + quantity,
        };
        // Update backend
        if (cartId) {
          fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart_id: cartId,
              product_id: uniqueId,
              quantity: updatedCart[index].quantity,
            }),
          });
        }
        return updatedCart;
      } else {
        // Add as new item
        const updatedCart = [...prevCart, { ...product, quantity }];
        // Add to backend
        if (cartId) {
          fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart_id: cartId,
              product_id: uniqueId,
              quantity,
            }),
          });
        }
        return updatedCart;
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => (item.product_id || item.id) !== productId)
    );
    if (cartId) {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          product_id: productId,
          quantity: 0,
        }),
      });
    }
  };

  // Update quantity for a product
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.product_id || item.id) === productId
          ? { ...item, quantity }
          : item
      )
    );
    if (cartId) {
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          product_id: productId,
          quantity,
        }),
      });
    }
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
    // Optionally clear backend cart items as well
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        discountCode,
        setDiscountCode,
        appliedDiscount,
        setAppliedDiscount,
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
