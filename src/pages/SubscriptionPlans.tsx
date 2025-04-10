
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorData {
  id: string;
  shop_name: string;
  subscription_status: string;
  subscription_expires_at: string;
}

const plans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: '$0',
    period: 'for 30 days',
    description: 'Try our platform with limited features',
    features: [
      'List up to 10 products',
      'Basic analytics',
      'Standard support',
      'No commission fees',
    ],
    color: 'bg-gray-100',
    textColor: 'text-gray-800',
    buttonVariant: 'outline',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$1,000',
    period: 'per month',
    description: 'Everything you need to grow your business',
    features: [
      'Unlimited products',
      'Advanced analytics',
      'Priority support',
      'Lower commission fees',
      'Featured in search results',
      'Custom shop branding',
    ],
    color: 'bg-brand-teal/10',
    textColor: 'text-brand-teal',
    buttonVariant: 'default',
    isPopular: true,
  }
];

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('id, shop_name, subscription_status, subscription_expires_at')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setVendorData(data);
      } catch (error: any) {
        console.error('Error fetching vendor data:', error);
        toast({
          title: "Error",
          description: "Could not fetch your vendor information. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [user, navigate, toast]);

  const handleSubscribe = async (planId: string) => {
    if (!user || !vendorData) return;
    
    setSubscribing(true);
    
    try {
      // In a real application, this would redirect to a payment gateway
      // For now, we'll just update the subscription status
      
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month
      
      // Update vendor subscription status
      const { error: vendorError } = await supabase
        .from('vendors')
        .update({
          subscription_status: planId,
          subscription_expires_at: expiryDate.toISOString(),
        })
        .eq('id', vendorData.id);
        
      if (vendorError) throw vendorError;
      
      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          vendor_id: vendorData.id,
          plan_type: planId,
          amount: planId === 'premium' ? 1000 : 0,
          status: 'active',
          expires_at: expiryDate.toISOString(),
        });
        
      if (subscriptionError) throw subscriptionError;
      
      toast({
        title: "Subscription Updated",
        description: `You are now on the ${planId === 'premium' ? 'Premium' : 'Free Trial'} plan`,
      });
      
      // Update local state
      setVendorData({
        ...vendorData,
        subscription_status: planId,
        subscription_expires_at: expiryDate.toISOString(),
      });
      
    } catch (error: any) {
      toast({
        title: "Subscription Failed",
        description: error.message || "An error occurred while updating your subscription",
        variant: "destructive"
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-10 mx-auto text-center">
          <h1 className="mb-4 text-2xl font-bold">You're not a vendor yet</h1>
          <p className="mb-6 text-muted-foreground">
            Register your shop first to access subscription plans.
          </p>
          <Button onClick={() => navigate('/become-vendor')}>
            Become a Vendor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-6xl py-10 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-navy">Subscription Plans</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the right plan for your business
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = vendorData.subscription_status === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`border-2 ${isCurrentPlan ? 'border-brand-teal' : 'border-transparent'} ${plan.color}`}
              >
                {plan.isPopular && (
                  <div className="absolute px-3 py-1 text-xs font-medium -translate-y-1/2 rounded-full top-0 right-4 bg-brand-teal text-white">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={`text-2xl font-bold ${plan.textColor}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 mr-2 text-brand-teal" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.buttonVariant === 'default' ? 'bg-brand-teal hover:bg-brand-teal/90' : ''
                    }`}
                    variant={plan.buttonVariant as any}
                    disabled={isCurrentPlan || subscribing}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {vendorData.subscription_status && (
          <div className="p-4 mt-8 border rounded-lg bg-gray-50">
            <p className="font-medium">
              Current plan: <span className="font-bold text-brand-teal">{
                vendorData.subscription_status === 'premium' ? 'Premium' : 'Free Trial'
              }</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Expires on: {new Date(vendorData.subscription_expires_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
