"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

const EssentialKitsPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: "Starter Kit", items: ["Bowls", "Cups", "Cutlery"] },
    {
      id: 2,
      name: "Premium Kit",
      items: ["Bowls", "Cups", "Napkins", "Cutlery"],
    },
  ];

  const handleAddKitToCart = (kit) => {
    kit.items.forEach((item) => {
      addToCart({ name: item, product_id: `${kit.id}-${item}` }, 1);
    });
    alert(`${kit.name} added to cart!`);
  };

  return (
    <div className="kits-container">
      <h1>Essential Kits Configurator</h1>
      <div className="kits-list">
        {products.map((kit) => (
          <div key={kit.id} className="kit-item">
            <h2>{kit.name}</h2>
            <ul>
              {kit.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button onClick={() => handleAddKitToCart(kit)}>
              Add Kit to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssentialKitsPage;
