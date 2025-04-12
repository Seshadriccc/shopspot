
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Check, 
  CreditCard, 
  Landmark, 
  Wallet, 
  DollarSign,
  Home,
  Building,
  MapPin,
  Loader2
} from 'lucide-react';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeStep, setActiveStep] = useState('address');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    landmark: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  
  const handleAddressSubmit = () => {
    // Basic validation
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.postalCode) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setActiveStep('payment');
  };
  
  const handlePaymentSubmit = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Your cart is empty, please add items before checkout",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to process the payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      clearCart();
      navigate('/order-success');
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and will be delivered soon!",
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const orderSummary = (
    <Card className="mt-6 lg:mt-0">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>₹50.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{(getTotalPrice() + 50 + getTotalPrice() * 0.05).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <div className="flex gap-2 mb-6">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                activeStep === 'address' || activeStep === 'payment' 
                  ? 'bg-brand-teal text-white' 
                  : 'bg-gray-200'
              }`}>
                {activeStep === 'address' 
                  ? '1' 
                  : <Check className="h-4 w-4" />
                }
              </div>
              <div className="flex-1 h-0.5 self-center bg-gray-200">
              </div>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                activeStep === 'payment' 
                  ? 'bg-brand-teal text-white' 
                  : 'bg-gray-200'
              }`}>
                2
              </div>
            </div>
            
            {activeStep === 'address' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Textarea 
                      id="street" 
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        placeholder="Enter your city"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        placeholder="Enter your state"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input 
                        id="postalCode" 
                        value={address.postalCode}
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                        placeholder="Enter your postal code"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <Input 
                      id="landmark" 
                      value={address.landmark}
                      onChange={(e) => setAddress({...address, landmark: e.target.value})}
                      placeholder="Enter a nearby landmark"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/cart')}>
                    Back to Cart
                  </Button>
                  <Button onClick={handleAddressSubmit}>
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {activeStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <DollarSign className="h-5 w-5" />
                        Cash on Delivery
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5" />
                        UPI
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Landmark className="h-5 w-5" />
                        Net Banking
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-6 border rounded-md p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-0.5 text-brand-teal" />
                      <div>
                        <h3 className="font-medium">Delivery Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.fullName}, {address.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.street}, {address.city}, {address.state} - {address.postalCode}
                        </p>
                        {address.landmark && (
                          <p className="text-sm text-muted-foreground">
                            Landmark: {address.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveStep('address')}>
                    Back to Address
                  </Button>
                  <Button 
                    disabled={isLoading} 
                    onClick={handlePaymentSubmit}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Display order summary on small screens */}
            <div className="lg:hidden">
              {orderSummary}
            </div>
          </div>
          
          {/* Order summary for larger screens */}
          <div className="hidden lg:block lg:w-1/3">
            {orderSummary}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
