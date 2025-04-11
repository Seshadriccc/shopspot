
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from './MenuItemCard';
import { MenuItem } from '@/utils/mockData';
import { Utensils, Coffee, CakeSlice, Wine, Salad } from 'lucide-react';

interface ShopMenuProps {
  menuItems: MenuItem[];
}

const ShopMenu: React.FC<ShopMenuProps> = ({ menuItems }) => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'appetizer':
        return <Salad className="mr-2 h-4 w-4" />;
      case 'main course':
        return <Utensils className="mr-2 h-4 w-4" />;
      case 'dessert':
        return <CakeSlice className="mr-2 h-4 w-4" />;
      case 'beverage':
        return <Coffee className="mr-2 h-4 w-4" />;
      default:
        return <Utensils className="mr-2 h-4 w-4" />;
    }
  };
  
  const handleAddComment = (itemId: string, rating: number, comment: string) => {
    // Add a new comment to the specific menu item
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          // Calculate new average rating
          const totalRatings = item.ratingCount + 1;
          const totalScore = (item.averageRating * item.ratingCount) + rating;
          const newAverageRating = totalScore / totalRatings;
          
          return {
            ...item,
            ratingCount: totalRatings,
            averageRating: parseFloat(newAverageRating.toFixed(1)),
            comments: [
              {
                id: crypto.randomUUID(),
                userName: "You", // In a real app, this would come from the authenticated user
                userAvatar: "https://i.pravatar.cc/150?img=33",
                rating,
                comment,
                date: new Date().toISOString()
              },
              ...item.comments
            ]
          };
        }
        return item;
      })
    );
  };

  // Group menu items by category
  const itemsByCategory: Record<string, MenuItem[]> = {};
  categories.forEach(category => {
    itemsByCategory[category] = items.filter(item => item.category === category);
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto overflow-auto">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center">
              {getCategoryIcon(category)}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {itemsByCategory[category].map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShopMenu;
