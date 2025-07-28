"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [businessType, setBusinessType] = useState("");
  const [preferences, setPreferences] = useState([]);
  const router = useRouter();

  const handleSignup = async () => {
    if (!businessType || preferences.length === 0) {
      alert("Please select a business type and at least one preference.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, preferences }),
      });

      if (!response.ok) {
        throw new Error("Signup failed.");
      }

      alert("Signup successful!");
      router.push("/products");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>

      <label>
        Business Type:
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        >
          <option value="">Select a business type</option>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="catering">Catering</option>
        </select>
      </label>

      <label>
        Product Preferences:
        <div>
          <label>
            <input
              type="checkbox"
              value="bowls"
              onChange={(e) =>
                setPreferences((prev) =>
                  e.target.checked
                    ? [...prev, e.target.value]
                    : prev.filter((pref) => pref !== e.target.value)
                )
              }
            />
            Bowls
          </label>
          <label>
            <input
              type="checkbox"
              value="cups"
              onChange={(e) =>
                setPreferences((prev) =>
                  e.target.checked
                    ? [...prev, e.target.value]
                    : prev.filter((pref) => pref !== e.target.value)
                )
              }
            />
            Cups
          </label>
          <label>
            <input
              type="checkbox"
              value="cutlery"
              onChange={(e) =>
                setPreferences((prev) =>
                  e.target.checked
                    ? [...prev, e.target.value]
                    : prev.filter((pref) => pref !== e.target.value)
                )
              }
            />
            Cutlery
          </label>
        </div>
      </label>

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default SignupPage;
