
import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
}

export const Rating: React.FC<RatingProps> = ({ 
  value, 
  onChange, 
  max = 5 
}) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${
            star <= value 
              ? 'text-amber-500 fill-current' 
              : 'text-gray-300'
          }`}
          onClick={() => onChange?.(star)}
        />
      ))}
    </div>
  );
};
