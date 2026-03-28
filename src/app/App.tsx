import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './contexts/CartContext';
import { StoreStatusProvider } from './contexts/StoreStatusContext';

export default function App() {
  return (
    <CartProvider>
      <StoreStatusProvider>
        <RouterProvider router={router} />
      </StoreStatusProvider>
    </CartProvider>
  );
}
