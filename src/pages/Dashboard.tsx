
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, DollarSign, ShoppingCart, Plus, Store, Settings, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorData {
  id: string;
  shop_name: string;
  description: string;
  logo_url: string | null;
  subscription_status: string;
  subscription_expires_at: string;
}

interface StatsData {
  productCount: number;
  orderCount: number;
  revenue: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [stats, setStats] = useState<StatsData>({
    productCount: 0,
    orderCount: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('id, shop_name, description, logo_url, subscription_status, subscription_expires_at')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No vendor profile found
            setVendorData(null);
            setLoading(false);
            return;
          }
          throw error;
        }
        
        setVendorData(data);

        // Fetch vendor stats
        if (data) {
          // Product count
          const { count: productCount, error: productError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('vendor_id', data.id);
            
          if (productError) throw productError;
          
          // Order count and revenue
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('id, total_amount')
            .eq('vendor_id', data.id)
            .eq('status', 'completed');
            
          if (orderError) throw orderError;
          
          const orderCount = orderData?.length || 0;
          const revenue = orderData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
          
          setStats({
            productCount: productCount || 0,
            orderCount,
            revenue,
          });
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
          <Store className="w-16 h-16 mx-auto mb-4 text-brand-teal" />
          <h1 className="mb-4 text-2xl font-bold">You're not a vendor yet</h1>
          <p className="mb-6 text-muted-foreground">
            Register your shop to start selling products on ShopSpot.
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
      <div className="container py-10 mx-auto">
        <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            {vendorData.logo_url ? (
              <img 
                src={vendorData.logo_url} 
                alt={vendorData.shop_name} 
                className="w-12 h-12 mr-4 rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-12 h-12 mr-4 bg-brand-teal/10 rounded-full">
                <Store className="w-6 h-6 text-brand-teal" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">{vendorData.shop_name}</h1>
              <p className="text-sm text-muted-foreground">
                {vendorData.subscription_status === 'premium' ? 'Premium' : 'Free Trial'} · 
                Expires {new Date(vendorData.subscription_expires_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-brand-teal hover:bg-brand-teal/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/subscription')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Subscription
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productCount}</div>
              <p className="text-xs text-muted-foreground">
                {vendorData.subscription_status === 'free_trial' && stats.productCount >= 10 
                  ? 'Limit reached. Upgrade to Premium.' 
                  : vendorData.subscription_status === 'free_trial'
                  ? `${10 - stats.productCount} more allowed in Free Trial`
                  : 'Unlimited in Premium plan'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orderCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.orderCount > 0 
                  ? `${(stats.orderCount / (stats.orderCount + 10) * 100).toFixed(1)}% completion rate` 
                  : 'No orders yet'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.revenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.orderCount > 0 
                  ? `${(stats.revenue / stats.orderCount).toFixed(2)} avg. order value` 
                  : 'No revenue yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard 
              title="Manage Products" 
              description="Add, edit, or remove your products"
              icon={<Package className="w-5 h-5" />}
              onClick={() => navigate('/products')}
            />
            <QuickActionCard 
              title="View Orders" 
              description="Check your orders and fulfill them"
              icon={<ShoppingCart className="w-5 h-5" />}
              onClick={() => navigate('/orders')}
            />
            <QuickActionCard 
              title="Upgrade Plan" 
              description="Get more features with Premium"
              icon={<DollarSign className="w-5 h-5" />}
              onClick={() => navigate('/subscription')}
            />
            <QuickActionCard 
              title="Store Settings" 
              description="Manage your store information"
              icon={<Settings className="w-5 h-5" />}
              onClick={() => navigate('/settings')}
              disabled={true}
              comingSoon={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  disabled = false,
  comingSoon = false 
}: QuickActionCardProps) => {
  return (
    <button
      className={`flex items-center p-4 text-left border rounded-lg ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-brand-teal hover:shadow-sm cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="p-2 mr-4 rounded-full bg-brand-teal/10 text-brand-teal">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {comingSoon && (
          <span className="inline-block px-2 py-1 mt-1 text-xs bg-gray-100 rounded">Coming Soon</span>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
};

export default Dashboard;
