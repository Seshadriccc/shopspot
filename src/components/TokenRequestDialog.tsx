
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shop } from '@/utils/mockData';

interface TokenRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
}

const TokenRequestDialog = ({ isOpen, onClose, shop }: TokenRequestDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestToken = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request tokens",
        variant: "destructive"
      });
      onClose();
      return;
    }

    setIsRequesting(true);
    try {
      // Simulate a vendor ID from the mock shop
      // In a real app, this would come from the database
      const mockVendorId = shop.id;
      
      // Check if this user already has tokens from this vendor
      const { data: existingTokens, error: checkError } = await supabase
        .from('user_tokens')
        .select('id, token_count')
        .eq('user_id', user.id)
        .eq('vendor_id', mockVendorId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingTokens) {
        // User already has tokens, update the count (max 3)
        const newCount = Math.min(existingTokens.token_count + 1, 3);
        
        if (newCount === existingTokens.token_count) {
          toast({
            title: "Token Limit Reached",
            description: "You've already reached the maximum of 3 tokens from this shop",
          });
          onClose();
          return;
        }
        
        const { error: updateError } = await supabase
          .from('user_tokens')
          .update({ token_count: newCount })
          .eq('id', existingTokens.id);
          
        if (updateError) throw updateError;
      } else {
        // User doesn't have tokens yet, create a new entry
        const { error: insertError } = await supabase
          .from('user_tokens')
          .insert({
            user_id: user.id,
            vendor_id: mockVendorId,
            token_count: 1
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Token Received!",
        description: `You've received a digital token from ${shop.name}`,
      });
      
    } catch (error: any) {
      console.error('Error requesting token:', error);
      toast({
        title: "Error",
        description: "Could not request token. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Digital Token</DialogTitle>
          <DialogDescription>
            Request a digital token from {shop.name} that you can use for discounts on future purchases.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 flex items-center justify-center bg-brand-teal/10 rounded-full mb-4">
            <Ticket className="w-8 h-8 text-brand-teal" />
          </div>
          <h3 className="text-lg font-medium mb-1">Digital Token</h3>
          <p className="text-center text-muted-foreground mb-4">
            Each token is worth $0.30 in discounts<br />
            You can collect up to 3 tokens per shop
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRequesting}>
            Cancel
          </Button>
          <Button onClick={handleRequestToken} disabled={isRequesting} className="bg-brand-teal hover:bg-brand-teal/90">
            {isRequesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Token"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenRequestDialog;
