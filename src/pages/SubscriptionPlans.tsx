
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2, CreditCard, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { processSubscriptionPayment, getSubscriptionHistory } from '@/services/paymentService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VendorData {
  id: string;
  shop_name: string;
  subscription_status: string;
  subscription_expires_at: string;
}

interface SubscriptionRecord {
  id: string;
  vendor_id: string;
  plan_type: string;
  amount: number;
  status: string;
  expires_at: string;
  created_at: string;
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
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionRecord[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("plans");

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('id, shop_name, subscription_status, subscription_expires_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        setVendorData(data);
        
        // Fetch subscription history
        if (data) {
          const history = await getSubscriptionHistory(data.id);
          setSubscriptionHistory(history as SubscriptionRecord[]);
        }
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

  const handleSubscribeClick = (planId: string) => {
    if (planId === 'free_trial') {
      // No payment needed for free trial
      handleSubscribe(planId);
    } else {
      // Show payment dialog for premium
      setSelectedPlan(planId);
      setShowPaymentDialog(true);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user || !vendorData) return;
    
    setSubscribing(true);
    setShowPaymentDialog(false);
    
    try {
      const amount = planId === 'premium' ? 1000 : 0;
      
      const result = await processSubscriptionPayment(
        vendorData.id,
        planId,
        amount
      );
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      toast({
        title: "Subscription Updated",
        description: `You are now on the ${planId === 'premium' ? 'Premium' : 'Free Trial'} plan`,
      });
      
      // Refresh subscription history
      const history = await getSubscriptionHistory(vendorData.id);
      setSubscriptionHistory(history as SubscriptionRecord[]);
      
      // Update local state
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      
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
          <h1 className="text-3xl font-bold text-brand-navy">Subscription Management</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the right plan for your business
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="pt-6">
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
                        onClick={() => handleSubscribeClick(plan.id)}
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
          </TabsContent>
          
          <TabsContent value="history" className="pt-6">
            {subscriptionHistory.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No billing history</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your subscription transactions will appear here
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-4 p-4 bg-muted/50 text-sm font-medium">
                  <div>Date</div>
                  <div>Plan</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {subscriptionHistory.map((record) => (
                    <div key={record.id} className="grid grid-cols-4 p-4 text-sm">
                      <div className="text-muted-foreground">
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                      <div className="font-medium">
                        {record.plan_type === 'premium' ? 'Premium Plan' : 'Free Trial'}
                      </div>
                      <div>
                        ${record.amount.toFixed(2)}
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Enter your payment details to subscribe to the Premium plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="font-medium">Premium Plan</div>
              <div className="text-2xl font-bold mt-1">$1,000</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
            
            <div className="space-y-3">
              <div className="form-group">
                <label className="text-sm font-medium mb-1 block">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    className="w-full border rounded-md pl-10 py-2 px-3" 
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="text" 
                      className="w-full border rounded-md pl-10 py-2 px-3" 
                      placeholder="MM/YY"
                      defaultValue="12/25"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">CVC</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-md py-2 px-3" 
                    placeholder="123"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button 
              className="bg-brand-teal hover:bg-brand-teal/90"
              onClick={() => handleSubscribe('premium')}
              disabled={subscribing}
            >
              {subscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay $1,000</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
