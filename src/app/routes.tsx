import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Admin } from './pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'confirmation', Component: Confirmation },
      { path: 'admin', Component: Admin },
    ],
  },
]);
