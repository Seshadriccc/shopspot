
export interface Shop {
  id: string;
  name: string;
  category: ShopCategory;
  image: string;
  rating: number;
  ratingCount: number;
  address: string;
  distance: number; // in km
  description: string;
  offers: Offer[];
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours: {
    open: string;
    close: string;
  };
}

export interface Offer {
  id: string;
  title: string;
  discount: number;
  validUntil: string;
  description: string;
}

export type ShopCategory = 'clothing' | 'grocery' | 'restaurant' | 'streetFood' | 'electronics' | 'home';

export const categories: { id: ShopCategory; name: string; icon: string }[] = [
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'grocery', name: 'Grocery', icon: '🛒' },
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
  { id: 'streetFood', name: 'Street Food', icon: '🌮' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'home', name: 'Home Goods', icon: '🏠' },
];

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Fashion Forward',
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    rating: 4.5,
    ratingCount: 120,
    address: '123 Main St, Anytown',
    distance: 0.8,
    description: 'Trendy clothing store with the latest styles and amazing deals.',
    coordinates: { lat: 40.7128, lng: -74.006 },
    offers: [
      {
        id: '101',
        title: 'Summer Sale',
        discount: 30,
        validUntil: '2025-06-30',
        description: '30% off all summer clothing items',
      },
      {
        id: '102',
        title: 'New Customer',
        discount: 10,
        validUntil: '2025-12-31',
        description: '10% off your first purchase',
      }
    ],
    openingHours: { open: '09:00', close: '21:00' }
  },
  {
    id: '2',
    name: 'Fresh Grocer',
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    rating: 4.2,
    ratingCount: 89,
    address: '456 Oak Ave, Anytown',
    distance: 1.2,
    description: 'Local grocery store with fresh produce and organic options.',
    coordinates: { lat: 40.7135, lng: -74.005 },
    offers: [
      {
        id: '201',
        title: 'Weekend Special',
        discount: 15,
        validUntil: '2025-07-15',
        description: '15% off all produce on weekends',
      }
    ],
    openingHours: { open: '08:00', close: '22:00' }
  },
  {
    id: '3',
    name: 'Spice Haven',
    category: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.8,
    ratingCount: 230,
    address: '789 Elm Blvd, Anytown',
    distance: 0.5,
    description: 'Authentic Indian cuisine with a modern twist.',
    coordinates: { lat: 40.7140, lng: -74.008 },
    offers: [
      {
        id: '301',
        title: 'Happy Hour',
        discount: 20,
        validUntil: '2025-08-01',
        description: '20% off all appetizers from 4-6pm',
      },
      {
        id: '302',
        title: 'Tuesday Special',
        discount: 25,
        validUntil: '2025-12-31',
        description: '25% off all curries every Tuesday',
      }
    ],
    openingHours: { open: '11:00', close: '23:00' }
  },
  {
    id: '4',
    name: 'Taco Truck Delights',
    category: 'streetFood',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
    rating: 4.7,
    ratingCount: 156,
    address: 'Corner of Pine & 4th St, Anytown',
    distance: 0.3,
    description: 'Authentic street tacos with homemade salsas.',
    coordinates: { lat: 40.7125, lng: -74.009 },
    offers: [
      {
        id: '401',
        title: 'Taco Tuesday',
        discount: 40,
        validUntil: '2025-12-31',
        description: '40% off all tacos every Tuesday',
      }
    ],
    openingHours: { open: '11:00', close: '20:00' }
  },
  {
    id: '5',
    name: 'TechWorld',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    rating: 4.1,
    ratingCount: 78,
    address: '321 Tech Blvd, Anytown',
    distance: 1.5,
    description: 'Latest gadgets and electronics at competitive prices.',
    coordinates: { lat: 40.7150, lng: -74.007 },
    offers: [
      {
        id: '501',
        title: 'Clearance Sale',
        discount: 35,
        validUntil: '2025-05-30',
        description: 'Up to 35% off selected items',
      }
    ],
    openingHours: { open: '10:00', close: '20:00' }
  },
  {
    id: '6',
    name: 'Home Essentials',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126',
    rating: 4.3,
    ratingCount: 112,
    address: '555 Maple Dr, Anytown',
    distance: 2.1,
    description: 'Everything you need for your home at affordable prices.',
    coordinates: { lat: 40.7110, lng: -74.010 },
    offers: [
      {
        id: '601',
        title: 'Spring Cleaning',
        discount: 25,
        validUntil: '2025-06-15',
        description: '25% off all cleaning products',
      }
    ],
    openingHours: { open: '09:00', close: '19:00' }
  }
];
