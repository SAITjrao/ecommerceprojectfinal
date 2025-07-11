// app/components/Footer.js
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Grab n Go. All Rights Reserved</p>
          <div className="space-x-4">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms Of Service</a>
          </div>
        </div>
      </footer>
    );
  }