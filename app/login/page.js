"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            if (data.user.is_admin === true || data.user.is_admin === "true") {
              router.replace("/dashboards/admin");
            } else {
              router.replace("/dashboards/user");
            }
            return;
          }
        }
      } catch (err) {
        // Not logged in, do nothing
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        // Handle both boolean and string "true" for is_admin
        if (data.user.is_admin === true || data.user.is_admin === "true") {
          router.push("/dashboards/admin");
        } else {
          router.push("/dashboards/user");
        }
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to server");
    }
    setLoading(false);
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          {errorMsg && (
            <div className="text-red-500 text-sm">{errorMsg}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="animate-spin inline-block mr-2 rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
          <div className="block text-center mt-4">
            <Link href="/register" className="text-blue-500 hover:underline">
              Don&apos;t have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}