"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Load cart from localStorage or context
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate total amount
      const totalAmount = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID from auth
          items: cart,
          total_amount: totalAmount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Clear cart
      localStorage.removeItem('cart');
      setCart([]);
      
      // Redirect to order confirmation
      router.push(`/orders/${data.order_id}`);
      alert(`Your order has been created, with order id: ${data.order_id}`);
      router.push('/');
    } catch (err) {
      setError(err.message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="mb-6">
            {cart.map(item => (
              <div key={item.product_id} className="flex justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <div>
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>
                ${cart.reduce(
                  (sum, item) => sum + (item.price * item.quantity), 
                  0
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
}