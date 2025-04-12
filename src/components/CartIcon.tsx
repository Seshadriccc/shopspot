
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const CartIcon: React.FC = () => {
  const { getTotalItems, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  
  return (
    <div className="relative group">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/cart')}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center bg-brand-coral text-white"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
      
      {totalItems > 0 && (
        <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md p-2 z-50 border min-w-[180px]">
          <div className="font-medium text-sm mb-2">Cart Total: ₹{getTotalPrice().toFixed(2)}</div>
          <Button 
            size="sm" 
            className="w-full text-xs bg-brand-teal hover:bg-brand-teal/90"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
