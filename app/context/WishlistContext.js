"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Get user ID from session
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUserId(data.user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, []);

  // Load wishlist from localStorage if it exists
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // fetch user from server
  const fetchUser = async () => {
  try {
    const response = await fetch("/api/me");
    if (response.ok) {
      const data = await response.json();
      if (data.authenticated && data.user) {
        setUserId(data.user.id);
      }
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
  };

  // Load wishlist from server - memoized to prevent infinite calls
  const loadWishlist = useCallback(async () => {
    if (!userId || hasLoaded) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/wishlist?user_id=${userId}`);

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
        setHasLoaded(true);
      } else {
        console.error("Failed to load wishlist:", response.status);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, hasLoaded]);

  // Load wishlist when userId changes
  useEffect(() => {
    if (userId && !hasLoaded) {
      loadWishlist();
    }
  }, [userId, hasLoaded, loadWishlist]);

  // Add product to wishlist
  const addToWishlist = async (product) => {
    if (!userId) {
      return {
        success: false,
        message: "Please login to add items to wishlist",
      };
    }

    const productId = product.id || product.id;

    // Check if already in wishlist
    if (wishlist.some((item) => (item.id || item.id) === productId)) {
      return { success: false, message: "Product already in wishlist" };
    }

    try {
      setLoading(true);
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
        }),
      });

      if (response.ok) {
        setWishlist((prev) => [...prev, product]);
        return { success: true, message: "Added to wishlist" };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Failed to add to wishlist",
        };
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return { success: false, message: "Failed to add to wishlist" };
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!userId) {
      return { success: false, message: "Please login to manage wishlist" };
    }

    try {
      setLoading(true);
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: userId,
        }),
      });

      if (response.ok) {
        setWishlist((prev) =>
          prev.filter((item) => (item.id || item.id) !== productId)
        );
        return { success: true, message: "Removed from wishlist" };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Failed to remove from wishlist",
        };
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return { success: false, message: "Failed to remove from wishlist" };
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.id) === productId);
  };

  // Toggle wishlist status
  const toggleWishlist = async (product) => {
    const productId = product.id || product.id;

    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(product);
    }
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");
    setHasLoaded(false);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        loadWishlist,
        clearWishlist,
        loading,
        userId,
        fetchUser,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
