import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho !`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-semibold text-amber-600">${product.price.toFixed(2)}</p>
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full bg-amber-600 hover:bg-amber-700">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
