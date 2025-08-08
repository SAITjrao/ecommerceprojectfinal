"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProducts } from "@/lib/fetchAllProducts";
import { Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext"; // Import Wishlist context

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale);

export default function AdminDashboard() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist(); // Add this if you have a wishlist context
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [userNames, setUserNames] = useState({}); // user_id: "First Last"
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesError, setSalesError] = useState(null);
  const [salesFilter, setSalesFilter] = useState("month"); // week, month, year, all
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add state for search
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    if (activeTab === "products") {
      loadProducts(productSearch);
    } else if (activeTab === "orders") {
      loadOrders();
    }
  }, [productSearch, page, pageSize, activeTab]);

  // Update loadProducts to accept a search query
  const loadProducts = async (search = "") => {
    try {
      setLoading(true);
      const { data, count } = await fetchProducts(page, pageSize, search);
      setProducts(data);
      setTotalProducts(count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/orders?page=${page}&pageSize=${pageSize}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalOrders(data.total || 0);
      } else {
        throw new Error("Failed to load orders");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders
        loadOrders();
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.order_id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pickup":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const totalPages = Math.ceil(
    (activeTab === "products" ? totalProducts : totalOrders) / pageSize
  );

  // Fetch user names for orders
  useEffect(() => {
    async function fetchUserNames() {
      if (orders.length === 0) return;
      const newNames = { ...userNames };
      const userIdsToFetch = orders
        .map((order) => order.user_id)
        .filter((id) => id && !newNames[id]);
      if (userIdsToFetch.length === 0) return;

      // Fetch all missing user names in parallel
      await Promise.all(
        userIdsToFetch.map(async (userId) => {
          try {
            const res = await fetch(`/api/users/${userId}`);
            if (res.ok) {
              const { data } = await res.json();
              if (data && data.fname && data.lname) {
                newNames[userId] = `${data.fname} ${data.lname}`;
              }
            }
          } catch (err) {
            // fallback to userId if fetch fails
            newNames[userId] = userId.substring(0, 8) + "...";
          }
        })
      );
      setUserNames(newNames);
    }
    fetchUserNames();
    // eslint-disable-next-line
  }, [orders]);

  // Fetch sales data for chart
  useEffect(() => {
    async function fetchSales() {
      setSalesLoading(true);
      setSalesError(null);
      try {
        const res = await fetch(`/api/orders/sales?range=${salesFilter}`);
        if (!res.ok) throw new Error("Failed to fetch sales data");
        const { data } = await res.json();
        setSalesData(data || []);
      } catch (err) {
        setSalesError(err.message);
      } finally {
        setSalesLoading(false);
      }
    }
    fetchSales();
  }, [salesFilter]);

  // Prepare chart data
  const chartData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "Number of Orders",
        data: salesData.map((d) => d.count),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        yAxisID: "y",
      },
      {
        label: "Total Sales ($)",
        data: salesData.map((d) => d.total),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: salesFilter === "week" ? "day" : salesFilter === "year" ? "month" : "day",
          tooltipFormat: "PP",
        },
        title: { display: true, text: "Date" },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Number of Orders" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Total Sales ($)" },
      },
    },
  };

  // Prepare scatterplot data: each point is a day, showing number of orders and total value
  const scatterData = {
    datasets: [
      {
        label: "Orders per Day",
        data: salesData.map((d) => ({
          x: d.date,      // date (YYYY-MM-DD)
          y: d.total,     // total value for that day
          count: d.count, // number of orders for that day
        })),
        backgroundColor: "#2E8B57",
        borderColor: "#2E8B57",
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.raw;
            return [
              `Date: ${point.x}`,
              `Total Value: $${point.y.toFixed(2)}`,
              `Orders: ${point.count}`,
            ];
          },
        },
        mode: "nearest",
        intersect: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "PP",
        },
        title: { display: true, text: "Date" },
      },
      y: {
        type: "linear",
        display: true,
        title: { display: true, text: "Total Value ($)" },
      },
    },
  };

  const openProductModal = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  // Add this function to open the modal for adding a new product
  const openAddProductModal = () => {
    setEditingProduct({
      name: "",
      price: 0,
      description: "",
      material: "",
      quantity: 0,
      category: "",
      stock: 0,
      image_url: "",
    });
    setShowProductModal(true);
  };

  const handleProductChange = (field, value) => {
    setEditingProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update saveProduct to handle both add and edit
  const saveProduct = async () => {
    try {
      const method = editingProduct.id ? "PATCH" : "POST";
      const url = editingProduct.id
        ? `/api/products/${editingProduct.id}`
        : `/api/products`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
        credentials: "include",
      });

      if (res.ok) {
        setShowProductModal(false);
        setEditingProduct(null);
        loadProducts(); // Refresh product list
      } else {
        alert("Failed to save product.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Add this function to handle product deletion
  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        loadProducts(); // Refresh product list
      } else {
        alert(data.error || "Failed to delete product.");
      }
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      clearCart();
      clearWishlist(); // Clear wishlist on logout
      router.replace("/login");
    } catch (err) {
      // Optionally show error
    } finally {
      setLogoutLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          disabled={logoutLoading}
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Sales Chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
          <select
            value={salesFilter}
            onChange={e => setSalesFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="week">Last Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        {salesLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : salesError ? (
          <div className="p-4 bg-red-100 text-red-700 rounded">Error: {salesError}</div>
        ) : (
          <>
            <div className="w-full md:w-2/4 mx-auto">
              <Scatter data={scatterData} options={scatterOptions} height={200} />
            </div>
            <div className="mt-6 flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-700">
                Total Orders: {salesData.reduce((sum, d) => sum + (d.count || 0), 0)}
              </div>
              <div className="text-lg font-semibold text-gray-700">
                Total Value: ${salesData.reduce((sum, d) => sum + (d.total || 0), 0).toFixed(2)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Product Inventory
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Order Management
          </button>
        </nav>
      </div>

      {/* Pagination Controls */}
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
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-2">
            {activeTab === "products" ? "products" : "orders"} per page
          </span>
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

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={openAddProductModal}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 10
                            ? "In Stock"
                            : product.stock > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => openProductModal(product)}
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => deleteProduct(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50 cursor-pointer">
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => openOrderModal(order)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        #{order.order_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userNames[order.user_id]
                          ? userNames[order.user_id]
                          : order.user_id?.substring(0, 8) + "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${order.total_amount?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.order_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.status !== "pickup" ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.order_id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="pickup">Pickup</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Cannot change pickup status
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.order_id}
                </h3>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Order ID:</span> #{selectedOrder.order_id}</div>
                    <div><span className="font-medium">Customer ID:</span> {selectedOrder.user_id}</div>
                    <div><span className="font-medium">Date:</span> {new Date(selectedOrder.order_date).toLocaleString()}</div>
                    <div><span className="font-medium">Total Amount:</span> ${selectedOrder.total_amount?.toFixed(2)}</div>
                    <div><span className="font-medium">Payment Status:</span> {selectedOrder.payment_status}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status Management</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Current Status:</span>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    {selectedOrder.status !== "pickup" ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Change Status:
                        </label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder.order_id, e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="pickup">Pickup</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Status cannot be changed once set to pickup
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 capitalize">{item.category}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">${item.price?.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">${(item.quantity * item.price)?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeOrderModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowProductModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingProduct.id ? "Edit Product" : "Add Product"}
            </h2>
            <div className="flex flex-col gap-3">
              <label>
                Name:
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => handleProductChange("name", e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={e => handleProductChange("price", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Description:
                <textarea
                  value={editingProduct.description ?? ""}
                  onChange={e => handleProductChange("description", e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Material:
                <input
                  type="text"
                  value={editingProduct.material ?? ""}
                  onChange={e => handleProductChange("material", e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Quantity /case:
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={e => handleProductChange("quantity", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={e => handleProductChange("category", e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Stock:
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={e => handleProductChange("stock", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  value={editingProduct.image_url ?? ""}
                  onChange={e => handleProductChange("image_url", e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowProductModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={saveProduct}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
