import React from 'react';
import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  /** Quando a loja está fechada (CMS) */
  addDisabled?: boolean;
}

export function ProductCard({ product, addDisabled }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (addDisabled) return;
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
        <p className="text-2xl font-semibold text-amber-600">R${product.price.toFixed(2)}</p>
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={addDisabled}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {addDisabled ? "Loja fechada" : "Adicionar 1 un."}
        </Button>
        {product.kits && product.kits.length > 0 && !addDisabled && (
          <div className="w-full grid grid-cols-2 gap-2">
            {[...product.kits].sort((a,b) => a.quantity - b.quantity).map((kit) => (
              <Button
                key={kit.quantity}
                onClick={() => {
                  addToCart(product, kit.quantity);
                  toast.success(`${kit.quantity}x ${product.name} adicionado!`);
                }}
                variant="outline"
                className="w-full text-xs font-semibold"
                size="sm"
              >
                + Kit {kit.quantity}
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
