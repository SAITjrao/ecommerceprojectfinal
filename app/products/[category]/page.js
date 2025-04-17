"use client";
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function CategoryPage({ params }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/${params.category}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.category]);

  
  const handleAddToCart = (product) => {
      console.log('Adding product to cart:', product);
      addToCart(product);
      alert(`Added ${product.name} to Cart`);
    };
    
    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;
  
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  if (loading) return <div>Loading...</div>;

  return (
    <main>

      {/* Category Banner */}
      <section
        className="relative bg-cover bg-center h-64 mb-8"
        style={{
          backgroundImage: `url('/categories/${params.category}.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
          <p className="mt-2 text-lg">Explore our best selection of {categoryName.toLowerCase()}.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading && <div className="text-center text-lg">Loading products...</div>}
        {error && <div className="text-center text-red-600">Error: {error}</div>}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center text-gray-600">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product) => (
                  
                  <div
                    key={product.product_id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
                  >
                    <div className="flex justify-between items-center mb-2 space-x-2">
                      <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                      <p className="text-xl text-gray-600 pl-10">${product.price}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add to Cart
                      </button>
                      <span className="text-md text-gray-700">Quantity: {product.quantity || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </main>
  );
}