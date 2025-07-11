import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
            Your Trusted Restaurant Supply Store
          </h1>
          <Link
            href="/products"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow"
          >
            View Products
          </Link>
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
              <Image
                src="/categories/containers.jpg"
                alt="Disposable Containers"
                width={400}
                height={300}
                className="w-full object-contain h-[300px] bg-white"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Disposable Containers</h3>
                <Link href="/products/containers" className="text-blue-500 hover:underline">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Disposable Bowls */}
            <div className="bg-white rounded shadow overflow-hidden">
              <Image
                src="/categories/bowls.jpg"
                alt="Disposable Bowls"
                width={400}
                height={300}
                className="w-full object-contain h-[300px] bg-white"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Disposable Bowls</h3>
                <Link href="/products/bowls" className="text-blue-500 hover:underline">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Cutlery */}
            <div className="bg-white rounded shadow overflow-hidden">
              <Image
                src="/categories/cutlery.jpg"
                alt="Cutlery"
                width={400}
                height={300}
                className="w-full object-contain h-[300px] bg-white"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Cutlery</h3>
                <Link href="/products/cutlery" className="text-blue-500 hover:underline">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Cups & Lids */}
            <div className="bg-white rounded shadow overflow-hidden">
              <Image
                src="/categories/cups.jpg"
                alt="Cups & Lids"
                width={400}
                height={300}
                className="w-full object-contain h-[300px] bg-white"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Cups & Lids</h3>
                <Link href="/products/cups" className="text-blue-500 hover:underline">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Napkins */}
            <div className="bg-white rounded shadow overflow-hidden">
              <Image
                src="/categories/napkins.jpg"
                alt="Napkins"
                width={400}
                height={300}
                className="w-full object-contain h-[300px] bg-white"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold mb-2">Napkins</h3>
                <Link href="/products/napkins" className="text-blue-500 hover:underline">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}