import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = ['cutlery', 'bowls', 'cups', 'napkins', 'containers'];

export default function ProductsPage() {
  return (
    <main>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(category => (
            <Link 
              key={category}
              href={`/products/${category}`}
              className="p-6 bg-white rounded-lg shadow text-center hover:bg-gray-50"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}