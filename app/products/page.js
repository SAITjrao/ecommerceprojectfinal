'use client';

import Link from 'next/link';
import { fetchProducts } from '@/lib/fetchAllProducts';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const categories = ['cutlery', 'bowls', 'cups', 'napkins', 'containers'];

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const { addToCart, cart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});

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
      product_id: product.product_id || product.id,
    };
    const uniqueId = normalizedProduct.product_id;
    const qty = selectedQuantities[uniqueId] || 1;
    addToCart(normalizedProduct, qty);
    alert(`Added ${qty} × ${normalizedProduct.name} to Cart`);
  };

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
        {categories.map(category => (
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
          <label htmlFor="pageSize" className="mr-2 font-medium">Show:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => {
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
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
    <div className="text-center text-gray-600 py-8">No products found.</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product, idx) => {
        const uniqueId = product.product_id || product.id || `${product.name}-${idx}`;
        return (
          <div
            key={uniqueId}
            className="bg-gray-50 rounded-lg shadow hover:shadow-md transition p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price}</p>
            <div className="flex items-center gap-2 mt-2">
              <label htmlFor={`qty-${uniqueId}`}>Qty:</label>
              <input
                id={`qty-${uniqueId}`}
                type="number"
                min="1"
                value={selectedQuantities[uniqueId] || 1}
                onChange={e =>
                  setSelectedQuantities(q => ({
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
              href={`/products/${product.category || 'all'}`}
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
    </div>
    </main>
  );
}