
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart from localStorage when the component is mounted
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = (item: MenuItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = currentItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        
        toast({
          title: 'Item quantity updated',
          description: `${item.name} quantity increased in your cart`,
        });
        
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        toast({
          title: 'Item added to cart',
          description: `${item.name} has been added to your cart`,
        });
        
        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === itemId);
      
      if (item) {
        toast({
          title: 'Item removed',
          description: `${item.name} has been removed from your cart`,
        });
      }
      
      return currentItems.filter(i => i.id !== itemId);
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(i => 
        i.id === itemId ? { ...i, quantity } : i
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    });
  };
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getTotalItems, 
        getTotalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
