"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const orderStates = [
  {
    id: "pending",
    label: "Order Pending",
    description: "Your order has been received and is pending confirmation",
  },
  {
    id: "processing",
    label: "Order Processing",
    description: "Your order is being prepared and processed",
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "Your order is on its way to you",
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Your order has been delivered successfully",
  },
  {
    id: "pickup",
    label: "Ready for Pickup",
    description: "Your order is ready for pickup at the store",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    description: "Your order has been cancelled",
  },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${params.order_id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Order not found");
          } else {
            setError("Failed to load order");
          }
          return;
        }

        const orderData = await response.json();
        setOrder(orderData);
        setCurrentStatus(orderData.status);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (params.order_id) {
      fetchOrder();
    }
  }, [params.order_id]);

  const getCurrentStateIndex = () => {
    return orderStates.findIndex((state) => state.id === currentStatus);
  };

  const handlePickupFromStore = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/orders/${params.order_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "pickup" }),
      });

      if (response.ok) {
        setCurrentStatus("pickup");
        setOrder((prev) => ({ ...prev, status: "pickup" }));
        alert("Order status updated to 'Ready for Pickup'");
      } else {
        const errorData = await response.json();
        alert(`Failed to update order status: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
            <p className="text-gray-600 mb-4">
              {error === "Order not found"
                ? "The order you're looking for doesn't exist."
                : "There was an error loading your order."}
            </p>
            <button
              onClick={() => router.push("/orders")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600">
              The order you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order #{order.order_id}
          </h1>
          <p className="text-gray-600">
            Placed on {formatDate(order.order_date)}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Payment Status: {order.payment_status}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">
              Total: ${order.total_amount.toFixed(2)}
            </div>
            {currentStatus !== "shipped" &&
              currentStatus !== "delivered" &&
              currentStatus !== "pickup" &&
              currentStatus !== "cancelled" && (
                <button
                  onClick={handlePickupFromStore}
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                >
                  {updating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Pick Up from Store"
                  )}
                </button>
              )}
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Status
          </h2>
          <div className="space-y-4">
            {orderStates.map((state, index) => {
              const isActive = state.id === currentStatus;
              const isCompleted = getCurrentStateIndex() >= index;
              const isCancelled =
                currentStatus === "cancelled" && state.id === "cancelled";

              return (
                <div key={state.id} className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive || isCompleted
                        ? currentStatus === "cancelled" &&
                          state.id !== "cancelled"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        isActive
                          ? currentStatus === "cancelled"
                            ? "text-red-600"
                            : "text-green-600"
                          : isCompleted
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {state.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {state.description}
                    </div>
                    {isActive && (
                      <div className="mt-2">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            currentStatus === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          Current Status
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Items ({order.items?.length || 0})
          </h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, index) => {
                const itemName = item.name || "Unknown Product";
                const itemPrice = item.price || 0;
                const itemQuantity = item.quantity || 1;
                const itemImage = item.image_url
                  ? `/products/${item.category}/${item.image_url}`
                  : "/categories/product1.jpg";

                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-16 h-16">
                      <Image
                        src={itemImage}
                        alt={itemName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = "/categories/product1.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {itemName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {itemQuantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ${itemPrice.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(itemPrice * itemQuantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found for this order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
