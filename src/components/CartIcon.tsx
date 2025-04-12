
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const CartIcon: React.FC = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  
  return (
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
  );
};

export default CartIcon;
