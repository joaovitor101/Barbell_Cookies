import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  return (
    <div className="min-h-screen cookie-background">
      <div className="cookie-background-accent-1"></div>
      <div className="cookie-background-accent-2"></div>
      
      {/* Hero Section */}
      <div className="cookie-content py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cookies Frescos !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handcrafted with love, delivered to your door. Order your favorite cookies today!
          </p>
        </div>
      </div>
      {/* Products Section */}
      <div className="cookie-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Cookies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}