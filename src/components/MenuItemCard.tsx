
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageCircle, Flame, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { MenuItem, Comment } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onAddComment?: (itemId: string, rating: number, comment: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddComment }) => {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter a comment before submitting",
        variant: "destructive"
      });
      return;
    }

    if (onAddComment) {
      onAddComment(item.id, newRating, newComment);
      setNewComment('');
      setNewRating(5);
      setShowCommentForm(false);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully"
      });
    }
  };

  // Render spicy level indicators
  const renderSpicyLevel = () => {
    if (item.spicyLevel === 0) return null;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: item.spicyLevel }).map((_, i) => (
          <Flame key={i} size={14} className="text-red-500" />
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for image loading errors
            e.currentTarget.src = "https://source.unsplash.com/random/400x300/?food";
          }}
        />
        {item.isVegetarian && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Vegetarian
          </Badge>
        )}
      </div>
      
      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="outline" className="bg-muted/50 mb-2">
            {item.category}
          </Badge>
          {renderSpicyLevel()}
        </div>
        
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
          
          <div className="flex items-center">
            <Star className="fill-amber-400 stroke-amber-400 h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {item.averageRating} ({item.ratingCount})
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="w-full">
          <Button 
            variant="ghost" 
            className="w-full justify-between"
            onClick={() => setShowComments(!showComments)}
          >
            <div className="flex items-center">
              <MessageCircle size={16} className="mr-2" />
              <span>
                {item.comments.length} {item.comments.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
            {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          
          {showComments && (
            <div className="mt-2 space-y-3">
              {item.comments.length > 0 ? (
                item.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <img 
                          src={comment.userAvatar} 
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full mr-2"
                          onError={(e) => {
                            e.currentTarget.src = "https://i.pravatar.cc/150";
                          }}
                        />
                        <div>
                          <p className="font-semibold text-sm">{comment.userName}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={cn(
                                  "mr-0.5",
                                  i < comment.rating ? "fill-amber-400 stroke-amber-400" : "stroke-gray-300"
                                )}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(comment.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No comments yet. Be the first to comment!
                </p>
              )}
              
              {!showCommentForm ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setShowCommentForm(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Comment
                </Button>
              ) : (
                <div className="bg-muted/30 p-3 rounded-md mt-2">
                  <div className="flex items-center mb-2">
                    <p className="text-sm mr-2">Your rating:</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          size={20}
                          className={cn(
                            "cursor-pointer",
                            rating <= newRating ? "fill-amber-400 stroke-amber-400" : "stroke-gray-300"
                          )}
                          onClick={() => setNewRating(rating)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Textarea
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] mb-2"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleAddComment}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
