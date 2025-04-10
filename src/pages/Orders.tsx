
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, ShoppingCart, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderData {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  vendor: {
    shop_name: string;
  };
  items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

interface VendorData {
  id: string;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrdersData = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        // Get vendor data first (if the user is a vendor)
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (vendorError && vendorError.code !== 'PGRST116') {
          throw vendorError;
        }
        
        setVendorData(vendorData);

        // Get all orders for this user (whether as customer or vendor)
        let query = supabase
          .from('orders')
          .select(`
            id, 
            created_at, 
            total_amount, 
            status,
            vendors:vendor_id (shop_name)
          `);
          
        // Filter based on whether the user is a customer or vendor
        if (vendorData) {
          // User is a vendor, get orders for their shop
          query = query.eq('vendor_id', vendorData.id);
        } else {
          // User is a customer, get their orders
          query = query.eq('user_id', user.id);
        }
          
        const { data: ordersData, error: ordersError } = await query
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // For each order, get the order items
        const ordersWithItems = await Promise.all((ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              products:product_id (name)
            `)
            .eq('order_id', order.id);
            
          if (itemsError) throw itemsError;
          
          // Transform to match our OrderData interface
          return {
            ...order,
            vendor: { shop_name: order.vendors.shop_name }, // Map vendors to vendor
            items: (items || []).map(item => ({
              id: item.id,
              product_name: item.products?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.price,
            })),
          };
        }));
        
        setOrders(ordersWithItems);
      } catch (error: any) {
        console.error('Error fetching orders data:', error);
        toast({
          title: "Error",
          description: "Could not fetch your orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [user, navigate, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by search query
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Filter by tab/status
    const matchesTab = 
      activeTab === 'all' || 
      order.status === activeTab;
      
    return matchesSearch && matchesTab;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-10 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(vendorData ? '/dashboard' : '/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back {vendorData ? 'to Dashboard' : 'to Home'}
        </Button>
        
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Orders</h1>
            <p className="text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? 's' : ''} {vendorData ? 'from customers' : 'placed'}
            </p>
          </div>
          
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input 
              placeholder="Search orders..." 
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-6 border rounded-lg bg-gray-50">
            <ShoppingCart className="w-12 h-12 mb-4 text-gray-400" />
            {orders.length === 0 ? (
              <>
                <h3 className="mb-2 text-lg font-medium">No Orders Yet</h3>
                <p className="text-center text-muted-foreground">
                  {vendorData 
                    ? "You haven't received any orders yet."
                    : "You haven't placed any orders yet."
                  }
                </p>
                {!vendorData && (
                  <Button 
                    onClick={() => navigate('/')}
                    className="mt-4 bg-brand-teal hover:bg-brand-teal/90"
                  >
                    Browse Shops
                  </Button>
                )}
              </>
            ) : (
              <>
                <h3 className="mb-2 text-lg font-medium">No Matching Orders</h3>
                <p className="text-center text-muted-foreground">
                  No orders match your search criteria. Try different keywords or filters.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="overflow-hidden border rounded-lg">
                <div className="flex flex-col justify-between p-4 border-b sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                    <p className="mt-1 text-sm">
                      {vendorData ? 'Customer' : 'Vendor'}: <span className="font-medium">{order.vendor.shop_name}</span>
                    </p>
                  </div>
                  <div className="mt-3 text-right sm:mt-0">
                    <p className="text-lg font-bold">${order.total_amount.toFixed(2)}</p>
                    <span className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <h4 className="mb-2 font-medium">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.product_name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">x{item.quantity}</span>
                        </div>
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
