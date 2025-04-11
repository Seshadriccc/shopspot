
import { Star, MapPin, Clock, Tag, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OfferBadge from "./OfferBadge";
import { formatDistance } from "@/utils/locationUtils";
import type { Shop } from "@/utils/mockData";
import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  shop: Shop;
  onClick: (shop: Shop) => void;
  showPriceComparison?: boolean;
  competitorPrice?: number | null;
}

const ShopCard = ({ shop, onClick, showPriceComparison = false, competitorPrice = null }: ShopCardProps) => {
  const { name, category, image, rating, distance, offers, openingHours } = shop;
  const navigate = useNavigate();

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

  return (
    <Card 
      className="overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(shop)}
    >
      <div className="relative h-40">
        {highestDiscount > 0 && <OfferBadge discount={highestDiscount} />}
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
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
          <MapPin size={14} />
          <span>{formatDistance(distance)} away</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock size={14} />
          <span>{openingHours.open} - {openingHours.close}</span>
        </div>
        
        {hasPrice && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <Tag size={14} className="text-brand-teal" />
            {highestDiscount > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-brand-teal">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs line-through text-muted-foreground">
                  ${displayOffer.originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold">${displayOffer.originalPrice.toFixed(2)}</span>
            )}
          </div>
        )}
        
        {showPriceComparison && hasPrice && savings !== null && savings > 0 && (
          <div className="mb-3 p-2 bg-green-50 rounded-md flex items-center gap-2">
            <Percent size={14} className="text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Save ${savings.toFixed(2)} ({savingsPercent}% cheaper) compared to competitors
            </span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-muted/50">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {offers.length > 0 && (
            <Badge className="bg-brand-coral">
              {offers.length} {offers.length === 1 ? 'Deal' : 'Deals'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
