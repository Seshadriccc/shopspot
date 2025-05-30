
import { faker } from '@faker-js/faker';
import { generateShops } from './generateMockData';

export type ShopCategory = "restaurant" | "retail" | "service" | "streetFood";

// Define categories with icons for UI display
export const categories = [
  { id: "restaurant", name: "Restaurants", icon: "🍽️" },
  { id: "retail", name: "Retail", icon: "🛍️" },
  { id: "service", name: "Services", icon: "🔧" },
  { id: "streetFood", name: "Street Food", icon: "🌮" }
];

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicyLevel: number;
  isVegetarian: boolean;
  averageRating: number;
  ratingCount: number;
  comments: Comment[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  originalPrice?: number;
  validUntil: string;
}

export interface OpeningHours {
  open: string;
  close: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  image: string;
  address: string;
  distance: number;
  rating: number;
  ratingCount: number;
  openingHours: OpeningHours;
  offers: Offer[];
  menuItems?: MenuItem[];
}

// Generate shops for all categories
export const mockShops: Shop[] = generateShops();
