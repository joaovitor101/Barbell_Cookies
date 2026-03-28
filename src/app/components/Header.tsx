import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';

export function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" style={{backgroundColor:'#EDE8D0'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="images/logo_sem_fundo.png" alt="" style={{ width: '80px', height: 'auto' }} />
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              Loja
            </Link>
            <Link
              to="/admin"
              className="text-sm text-gray-500 hover:text-amber-600 transition-colors"
            >
              CMS
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
