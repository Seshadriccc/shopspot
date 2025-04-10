
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorToken {
  id: string;
  vendor_id: string;
  token_count: number;
  shop_name: string;
  category: string;
  logo_url?: string;
}

const TokensPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<VendorToken[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_tokens')
          .select(`
            id,
            vendor_id,
            token_count,
            vendors:vendor_id (
              shop_name,
              category,
              logo_url
            )
          `)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Format the data
        const formattedTokens = data.map(item => ({
          id: item.id,
          vendor_id: item.vendor_id,
          token_count: item.token_count,
          shop_name: item.vendors.shop_name,
          category: item.vendors.category,
          logo_url: item.vendors.logo_url
        }));
        
        setTokens(formattedTokens);
        setTotalTokens(formattedTokens.reduce((sum, token) => sum + token.token_count, 0));
      } catch (error: any) {
        console.error('Error fetching tokens:', error);
        toast({
          title: "Error",
          description: "Could not fetch your tokens. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [user, toast]);

  const getDiscountValue = (tokenCount: number) => {
    return (tokenCount * 0.3).toFixed(2);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-10 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-navy">My Digital Tokens</h1>
          <p className="text-muted-foreground">
            Use your tokens for discounts when shopping at participating stores
          </p>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Total Tokens</CardTitle>
              <CardDescription>Current savings available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-brand-teal" />
                  <span className="text-3xl font-bold">{totalTokens}</span>
                </div>
                <div className="text-xl font-medium text-brand-coral">
                  ${getDiscountValue(totalTokens)} value
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Each token gives you a $0.30 discount at participating shops
              </p>
            </CardContent>
          </Card>
        </div>

        {tokens.length === 0 ? (
          <Card className="text-center p-6">
            <div className="flex flex-col items-center justify-center p-4">
              <ShoppingBag className="w-12 h-12 mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">No Tokens Yet</h3>
              <p className="text-center text-muted-foreground">
                Visit and purchase from local shops to earn digital tokens that you can use for discounts
              </p>
              <Button 
                onClick={() => navigate('/')} 
                className="mt-4 bg-brand-teal hover:bg-brand-teal/90"
              >
                Browse Shops
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tokens.map((token) => (
              <Card key={token.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{token.shop_name}</CardTitle>
                    <Badge variant="outline" className="bg-gray-100">
                      {token.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-brand-teal" />
                      <span className="text-lg font-bold">{token.token_count} tokens</span>
                    </div>
                    <div className="text-lg font-medium text-brand-coral">
                      ${getDiscountValue(token.token_count)} value
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use these tokens for discounts on your next purchase at this store
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/')}
                  >
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensPage;
