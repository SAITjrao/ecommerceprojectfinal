"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessType: "",
    location: "",
    cuisineType: "",
    kitchenSize: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Signup successful!");
        router.push("/login");
      } else {
        alert("Signup failed: " + data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1">First Name:</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full p-2 border rounded"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Last Name:</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full p-2 border rounded"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Business Type:</label>
            <input
              type="text"
              name="businessType"
              className="w-full p-2 border rounded"
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Location:</label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border rounded"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Cuisine Type:</label>
            <input
              type="text"
              name="cuisineType"
              className="w-full p-2 border rounded"
              value={formData.cuisineType}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Kitchen Size:</label>
            <input
              type="text"
              name="kitchenSize"
              className="w-full p-2 border rounded"
              value={formData.kitchenSize}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
