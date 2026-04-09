import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useStoreStatus } from '../contexts/StoreStatusContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import React from "react";
const bairros = [
  { name: 'Vila Ponce', taxa: 0 },
  { name: 'Vila Ribeiropolis', taxa: 0 },
  { name: 'Vila Alvorada', taxa: 0 },
  { name: 'Vila Yoshida', taxa: 0 },
  { name: 'Vila Cabral', taxa: 3 },
  { name: 'Nosso teto', taxa: 4 },
  { name: 'Jardim Brasil', taxa: 4 },
  { name: 'Jardim São Paulo', taxa: 5 },
  { name: 'Jardim Paulistano', taxa: 7 },
  { name: 'Vila Nova', taxa: 5 },
  { name: 'Centro', taxa: 5 },
  { name: 'Vila Tupy', taxa: 5 },
  { name: 'Vila São Francisco', taxa: 5 },
  { name: 'Vila Alay José Correa', taxa: 6 },
  { name: 'Jardim Valeri', taxa: 6 },
  { name: 'Cecap', taxa: 6 },
];

export function Checkout() {
  const { cart, getCartTotal, clearCart, getItemTotal } = useCart();
  const { storeOpen, loading: statusLoading } = useStoreStatus();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bairro: '',
    rua: '',
    number: '',
  });

  // Número do WhatsApp (altere para o seu número)
  const WHATSAPP_NUMBER = '5513997212430'; // Formato: código do país + DDD + número

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);

  const selectedBairroInfo = bairros.find(b => b.name === formData.bairro);
  const frete = selectedBairroInfo ? selectedBairroInfo.taxa : 0;
  const totalGeral = getCartTotal() + frete;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeOpen) {
      toast.error('A loja está fechada. Não é possível enviar o pedido agora.');
      return;
    }

    let message = 'Olá! Vou querer:\n\n';

    // emojis em unicode (NUNCA quebra)
    const cookieEmoji = '\u{1F36A}'; // 🍪
    const moneyEmoji = '\u{1F4B0}';  // 💰
    const pinEmoji = '\u{1F4CD}';    // 📍

    cart.forEach((item) => {
      message += `${cookieEmoji} ${item.quantity}x ${item.name}\n`;
    });

    message += '\n';

    const subtotalFormatado = getCartTotal().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    
    const freteFormatado = frete > 0 
       ? `R$ ${frete.toFixed(2).replace('.', ',')}` 
       : 'Grátis';

    const totalGeralFormatado = totalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    message += `🛒 Subtotal: ${subtotalFormatado}\n`;
    message += `🛵 Taxa de Entrega: ${freteFormatado}\n`;
    message += `${moneyEmoji} Total: *${totalGeralFormatado}*\n\n`;

    message += `${pinEmoji} *Dados para entrega:*\n`;
    message += `Nome: ${formData.firstName} ${formData.lastName}\n`;
    message += `Telefone: ${formData.phone}\n`;
    message += `Endereço: ${formData.rua}, ${formData.bairro}, ${formData.number}\n`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');
    clearCart();
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen cookie-background py-8">
      <div className="cookie-background-accent-1"></div>
      <div className="cookie-background-accent-2"></div>
      <div className="cookie-content max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        {!statusLoading && !storeOpen && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 text-sm">
            A loja está fechada. Finalizar pedido ficará disponível quando
            voltarmos a aceitar encomendas.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="rua">Rua</Label>
                      <Input
                        id="rua"
                        name="rua"
                        value={formData.rua}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="bairro">Bairro</Label>
                      <select
                        id="bairro"
                        name="bairro"
                        value={formData.bairro}
                        onChange={(e: any) => handleChange(e)}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>Selecione um bairro</option>
                        {bairros.map(b => (
                           <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="Nº"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                    </div>
                    <div>
                    </div>
                    <div>
                    </div>
                  </div>
                  <div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/cart')}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={!statusLoading && !storeOpen}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                    >
                      Finalizar Pedido
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        R${getItemTotal(item).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold">R${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Frete</span>
                      <span className={`font-semibold ${frete === 0 && formData.bairro !== '' ? 'text-green-600' : ''}`}>
                         {formData.bairro === '' ? '--' : frete === 0 ? 'GRÁTIS' : `R$${frete.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                      <span>Total Geral</span>
                      <span className="text-amber-600">R${totalGeral.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}