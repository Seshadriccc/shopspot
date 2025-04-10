
import { cn } from "@/lib/utils";

interface OfferBadgeProps {
  discount: number;
  className?: string;
}

const OfferBadge = ({ discount, className }: OfferBadgeProps) => {
  return (
    <div className={cn(
      "absolute top-2 right-2 bg-brand-coral text-white px-2 py-1 rounded-md text-xs font-bold shadow-md animate-pulse-light z-10",
      className
    )}>
      {discount}% OFF
    </div>
  );
};

export default OfferBadge;
