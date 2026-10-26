import React from 'react';
import { 
  ShoppingBag, 
  Pill, 
  CalendarCheck, 
  Car, 
  Home, 
  HeartHandshake, 
  HelpCircle 
} from 'lucide-react';
import { AssistanceCategory } from '../../types';

interface CategoryIconProps {
  category: AssistanceCategory | string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  className = 'w-5 h-5', 
  size = 20 
}) => {
  switch (category) {
    case 'grocery':
      return <ShoppingBag className={className} size={size} />;
    case 'medicine':
      return <Pill className={className} size={size} />;
    case 'appointment':
      return <CalendarCheck className={className} size={size} />;
    case 'transport':
      return <Car className={className} size={size} />;
    case 'household':
      return <Home className={className} size={size} />;
    case 'other':
      return <HeartHandshake className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};
