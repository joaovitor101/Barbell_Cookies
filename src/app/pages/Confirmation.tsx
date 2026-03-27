import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';
export function Confirmation() {
  const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="min-h-screen cookie-background flex items-center justify-center py-12">
      <div className="cookie-background-accent-1"></div>
      <div className="cookie-background-accent-2"></div>
      <div className="cookie-content max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-600 mb-2">Your order number is</p>
              <p className="text-2xl font-bold text-amber-600">{orderNumber}</p>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>We'll start baking your fresh cookies right away</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Your order will be delivered within 2-3 business days</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link to="/">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Continue Comprando
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}