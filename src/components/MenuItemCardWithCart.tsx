
import React, { useState } from 'react';
import { MenuItem } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { Star, MessageCircle, PlusCircle, Flame } from 'lucide-react';
import { Rating } from '@/components/Rating';

interface MenuItemCardProps {
  item: MenuItem;
  onAddComment: (itemId: string, rating: number, comment: string) => void;
}

const MenuItemCardWithCart: React.FC<MenuItemCardProps> = ({ item, onAddComment }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(item.id, rating, comment);
      setComment('');
      setRating(5);
      setIsCommentOpen(false);
    }
  };
  
  const renderSpicyLevel = () => {
    const flames = [];
    for (let i = 0; i < item.spicyLevel; i++) {
      flames.push(<Flame key={i} className="h-4 w-4 text-red-500 fill-current" />);
    }
    return flames;
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-40">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover"
        />
        {item.isVegetarian && (
          <Badge className="absolute top-2 right-2 bg-green-500">Veg</Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-medium">{item.averageRating}</span>
          </div>
        </div>
        
        {item.spicyLevel > 0 && (
          <div className="flex mt-1">
            {renderSpicyLevel()}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch gap-2 pt-0">
        <div className="flex justify-between items-center w-full">
          <div className="font-bold">₹{item.price.toFixed(2)}</div>
          <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{item.comments.length}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Review for {item.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="font-medium">Your Rating</div>
                  <Rating value={rating} onChange={setRating} />
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Your Comment</div>
                  <Textarea 
                    placeholder="Share your experience..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddComment} className="w-full">Submit Review</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Button 
          className="w-full bg-brand-teal hover:bg-brand-teal/90"
          onClick={() => addToCart(item)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCardWithCart;
