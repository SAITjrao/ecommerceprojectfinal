"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [preferences, setPreferences] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const result = await signIn(email, password);

      if (result.success) {
        alert(`Login successful! Welcome back.`);
        router.push("/products");
      } else {
        setErrorMsg(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Failed to connect to server");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!businessType || preferences.length === 0) {
      alert("Please select a business type and at least one preference.");
      return;
    }

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    console.log("Signup Data:", { email, password, businessType, preferences });

    try {
      // First create the auth user
      const authResult = await signUp(email, password, {
        businessType,
        preferences,
      });

      if (!authResult.success) {
        throw new Error(authResult.error);
      }

      // Then save additional user data to your users table
      const { error: userDataError } = await supabase.from("users").insert({
        auth_user_id: authResult.user.id,
        business_type: businessType,
        preferences: preferences,
        email: email,
      });

      if (userDataError) {
        console.error("Error saving user data:", userDataError);
        // Note: Auth user is still created even if this fails
      }

      alert(
        "Signup successful! Please check your email to verify your account."
      );
      router.push("/products");
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-4"
        >
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

          <div>
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isSignup && (
            <>
              <div>
                <label className="block mb-1">Business Type:</label>
                <select
                  required
                  className="w-full p-2 border rounded"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="">Select Business Type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="catering">Catering</option>
                  <option value="cafe">Cafe</option>
                  <option value="food_truck">Food Truck</option>
                  <option value="bakery">Bakery</option>
                  <option value="hotel">Hotel</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Product Preferences:</label>
                <div className="space-y-2">
                  {["cutlery", "bowls", "cups", "napkins", "containers"].map(
                    (category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={preferences.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferences([...preferences, category]);
                            } else {
                              setPreferences(
                                preferences.filter((p) => p !== category)
                              );
                            }
                          }}
                        />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </label>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </button>
        </div>
      </div>
    </div>
  );
}
