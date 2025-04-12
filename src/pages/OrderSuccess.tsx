
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderId = `ORD${Math.floor(Math.random() * 90000) + 10000}`;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-12 max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader className="pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Order Successful!</h1>
            <p className="text-muted-foreground mt-2">
              Thank you for your order. Your food is being prepared.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-6">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            
            <div className="space-y-2 text-sm text-left">
              <p className="font-medium">Order Details:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Your order will be delivered in 30-45 minutes</li>
                <li>You can track your order in the orders section</li>
                <li>Payment will be collected on delivery</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full gap-2 bg-brand-teal hover:bg-brand-teal/90"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => navigate('/orders')}
            >
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default OrderSuccess;
