// app/page.js
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
            Your Trusted Restaurant Supplies
          </h1>
          <a
            href="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow"
          >
            View Products
          </a>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Disposable Containers */}
            <div className="bg-white rounded shadow overflow-hidden">
              <img
                src="/categories/containers.jpg"
                alt="Disposable Containers"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Disposable Containers</h3>
                <a href="/products" className="text-blue-500 hover:underline">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Disposable Bowls */}
            <div className="bg-white rounded shadow overflow-hidden">
              <img
                src="/categories/bowls.jpg"
                alt="Disposable Bowls"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Disposable Bowls</h3>
                <a href="/products" className="text-blue-500 hover:underline">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Cutlery */}
            <div className="bg-white rounded shadow overflow-hidden">
              <img
                src="/categories/cutlery.jpg"
                alt="Cutlery"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Cutlery</h3>
                <a href="/products" className="text-blue-500 hover:underline">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Cups & Lids */}
            <div className="bg-white rounded shadow overflow-hidden">
              <img
                src="/categories/cups.jpg"
                alt="Cups & Lids"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Cups & Lids</h3>
                <a href="/products" className="text-blue-500 hover:underline">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Napkins */}
            <div className="bg-white rounded shadow overflow-hidden">
              <img
                src="/categories/napkins.jpg"
                alt="Napkins"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Napkins</h3>
                <a href="/products" className="text-blue-500 hover:underline">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}