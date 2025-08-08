"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  "Restaurant",
  "Cafe / Bakery",
  "Catering Service",
  "Food Truck",
  "Event Organizer",
  "Bar",
  "School",
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessType, setBusinessType] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleBusinessTypeChange = (type) => {
    setBusinessType((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          business_type: businessType, // send as array
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Registration successful! You can now log in.");
        router.push("/login");
      } else {
        setErrorMsg(data.message || "Registration failed");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex space-x-12">
            <div>
              <label className="block mb-1">First Name:</label>
              <input
                type="text"
                required
                className="w-42 p-2 border rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Last Name:</label>
              <input
                type="text"
                required
                className="w-42 p-2 border rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-10">
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Business Type:</label>
            <div className="flex flex-wrap gap-4">
              {BUSINESS_TYPES.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={businessType.includes(type)}
                    onChange={() => handleBusinessTypeChange(type)}
                    className="accent-green-600"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
