import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
          <Link to="/">
            <Button className="mt-4">Ver Cookies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 max-w-4xl mx-auto" >

      <h1 className="text-2xl font-bold my-6">Carrinho 🛒</h1>

      {/* LISTA */}
      <div className="space-y-4">
        {cart.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4">

                <img
                  src={item.image}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-amber-600 font-bold">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex sm:flex-col justify-between items-center gap-3">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </Button>

                    <Input
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 0)
                      }
                      className="w-12 text-center"
                    />

                    <Button size="sm" variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* BOTÃO FIXO */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

          <div>
            <p className="text-sm text-gray-500">
              {totalItems} item(s)
            </p>
            <p className="font-bold text-lg">
              R$ {getCartTotal().toFixed(2)}
            </p>
          </div>

          <Button
            onClick={() => navigate('/checkout')}
            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2 px-6 py-4 text-lg rounded-xl shadow-md"
          >
            Finalizar
            <span className="bg-white text-amber-600 text-sm px-2 py-1 rounded-full">
              {totalItems}
            </span>
          </Button>

        </div>
      </div>
    </div>
  );
}