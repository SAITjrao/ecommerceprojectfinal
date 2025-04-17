// app/components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo & Store Name */}
        <div className="flex items-center">
          <img
            src="/categories/supply-logo.jpg"
            alt="Supply Logo"
            className="h-10 w-auto mr-2"
          />
          <span className="text-2xl font-bold text-blue-500">
            Supply Store
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-blue-500">
            Products
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-500">
            Contact
          </Link>
        </nav>

        {/* Icons for Account and Cart */}
        <div className="flex space-x-4">
          <Link href="/login">
            <img
              src="/categories/login-icon.svg"
              alt="Login Icon"
              className="h-6 w-6"
            />
          </Link>
          <Link href="/cart">
            <img
              src="/categories/cart-icon.svg"
              alt="Cart Icon"
              className="h-6 w-6"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}