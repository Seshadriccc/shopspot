
import { Star, MapPin, Clock, Tag, Percent, Utensils, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OfferBadge from "./OfferBadge";
import { formatDistance } from "@/utils/locationUtils";
import type { Shop } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ShopCardProps {
  shop: Shop;
  onClick: (shop: Shop) => void;
  showPriceComparison?: boolean;
  competitorPrice?: number | null;
}

const ShopCard = ({ shop, onClick, showPriceComparison = false, competitorPrice = null }: ShopCardProps) => {
  const { name, category, image, rating, distance, offers, openingHours, menuItems, address } = shop;
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  // Get highest discount for the badge
  const highestDiscount = offers.length > 0 
    ? Math.max(...offers.map(offer => offer.discount)) 
    : 0;

  // Calculate discounted price for display if there are offers
  const displayOffer = offers.length > 0 ? offers[0] : null;
  const hasPrice = displayOffer && displayOffer.originalPrice;
  
  const discountedPrice = hasPrice 
    ? displayOffer.originalPrice * (100 - highestDiscount) / 100 
    : null;

  // Calculate savings if showing price comparison
  const savings = (competitorPrice && discountedPrice) 
    ? (competitorPrice - discountedPrice) 
    : null;
  
  const savingsPercent = (competitorPrice && discountedPrice) 
    ? Math.round((competitorPrice - discountedPrice) / competitorPrice * 100) 
    : null;

  // Check if shop has menu items
  const hasMenu = menuItems && menuItems.length > 0;
  
  // Extract city from address with more reliable parsing
  const city = address ? 
    address.split(',').pop()?.trim() || 
    address.split(' ').slice(-1)[0].trim() : 
    '';

  // Get fallback image based on category and shop name
  const getFallbackImage = () => {
    // Use shop name to create variation in fallback images
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = nameHash % 5; // Create 5 variations per category
    
    switch(category) {
      case 'restaurant':
        return [
          "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1602023039928-7af5a2f000fa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop"
        ][variation];
      case 'retail':
        return [
          "https://images.unsplash.com/photo-1605651202774-7d573f2174f5?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1601565580844-adbf80c50383?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582530239827-95150649530b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1608303588026-884cbd42f3eb?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1601751818941-571144562ff8?w=800&h=600&fit=crop"
        ][variation];
      case 'service':
        return [
          "https://images.unsplash.com/photo-1613987549117-13c4781ac9d2?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1622279488720-cf540e293b4a?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1533142266415-ac591a4deae9?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1536650135175-9b3cd4f86884?w=800&h=600&fit=crop"
        ][variation];
      case 'streetFood':
        return [
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1621241441637-ea2d3f59db22?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1589778655375-3c70785cd832?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&h=600&fit=crop"
        ][variation];
      default:
        return "https://images.unsplash.com/photo-1583668496597-b0ec8097ce36?w=800&h=600&fit=crop";
    }
  };

  // Add to cart handler - if it's a menu item from a restaurant or street food place
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (displayOffer && hasPrice) {
      // Create a cart item from the offer
      const offerItem = {
        id: displayOffer.id,
        name: displayOffer.title,
        price: discountedPrice || displayOffer.originalPrice,
        description: displayOffer.description,
        image: shop.image,
        category: "offer",
        isVegetarian: false, // Default
        spicyLevel: 0, // Default
        averageRating: shop.rating,
        ratingCount: 0,
        comments: []
      };
      
      addToCart(offerItem);
    }
  };

  // Set up category styled badges
  const getCategoryStyle = () => {
    switch(category) {
      case 'restaurant':
        return "bg-amber-50 text-amber-700 border-amber-200";
      case 'retail':
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 'service':
        return "bg-purple-50 text-purple-700 border-purple-200";
      case 'streetFood':
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted/50";
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(shop)}
    >
      <div className="relative h-40">
        {highestDiscount > 0 && <OfferBadge discount={highestDiscount} />}
        <img 
          src={imageError ? getFallbackImage() : image} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{name}</h3>
          <div className="flex items-center text-amber-500">
            <Star className="fill-current h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin size={14} className="text-brand-teal flex-shrink-0" />
          <span className="truncate">
            {formatDistance(distance)} away {city && `• ${city}`}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock size={14} className="flex-shrink-0" />
          <span>{openingHours.open} - {openingHours.close}</span>
        </div>
        
        {hasPrice && (
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-brand-teal flex-shrink-0" />
              {highestDiscount > 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-brand-teal">
                    ₹{discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs line-through text-muted-foreground">
                    ₹{displayOffer.originalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold">₹{displayOffer.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {hasPrice && (category === 'restaurant' || category === 'streetFood') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAddToCart}
                className="p-0 h-8 w-8"
              >
                <ShoppingCart size={16} className="text-brand-teal" />
              </Button>
            )}
          </div>
        )}
        
        {showPriceComparison && hasPrice && savings !== null && savings > 0 && (
          <div className="mb-3 p-2 bg-green-50 rounded-md flex items-center gap-2">
            <Percent size={14} className="text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium">
              Save ₹{savings.toFixed(2)} ({savingsPercent}% cheaper) compared to competitors
            </span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryStyle()}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {offers.length > 0 && (
            <Badge className="bg-brand-coral">
              {offers.length} {offers.length === 1 ? 'Deal' : 'Deals'}
            </Badge>
          )}
          {hasMenu && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Utensils size={12} />
              Menu
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
