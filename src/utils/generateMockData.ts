
import { faker } from '@faker-js/faker';
import type { Shop, ShopCategory, Offer, MenuItem, Comment } from './mockData';

// Corrected categories to match ShopCategory type
const categories: ShopCategory[] = [
  'restaurant', 
  'retail', 
  'service', 
  'streetFood'
];

// Generate random opening hours
const generateOpeningHours = () => {
  const openHour = faker.number.int({ min: 6, max: 11 });
  const closeHour = faker.number.int({ min: 17, max: 23 });
  return {
    open: `${openHour}:00 AM`,
    close: `${closeHour}:00 PM`
  };
};

// Generate random offers
const generateOffers = (count: number): Offer[] => {
  const offers: Offer[] = [];
  
  for (let i = 0; i < count; i++) {
    const originalPrice = parseFloat(faker.commerce.price({ min: 10, max: 200 }));
    const discount = faker.number.int({ min: 5, max: 40 });
    
    offers.push({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription().substring(0, 100),
      originalPrice,
      discount,
      validUntil: faker.date.future().toISOString()
    });
  }
  
  return offers;
};

// Generate comments for menu items and products
const generateComments = (count: number): Comment[] => {
  const comments = [];
  
  for (let i = 0; i < count; i++) {
    comments.push({
      id: faker.string.uuid(),
      userName: faker.person.fullName(),
      userAvatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentences({ min: 1, max: 3 }),
      date: faker.date.recent({ days: 60 }).toISOString()
    });
  }
  
  return comments;
};

// Generate menu items for restaurants and streetFood
const generateMenuItems = (category: ShopCategory): MenuItem[] => {
  if (category !== 'restaurant' && category !== 'streetFood') return [];
  
  const count = faker.number.int({ min: 8, max: 12 });
  const items = [];
  
  // Indian specific food items
  const foodTypes = {
    restaurant: ['biryani', 'curry', 'thali', 'dosa', 'paneer', 'naan'],
    streetFood: ['pani-puri', 'vada-pav', 'chaat', 'samosa', 'kachori', 'bhel-puri']
  };
  
  const foodType = category === 'restaurant' ? 'restaurant' : 'streetFood';
  const foodItems = foodTypes[foodType];
  
  // Indian cuisine categories
  const categories = category === 'restaurant' 
    ? ['Starters', 'Main Course', 'Breads', 'Desserts'] 
    : ['Popular', 'Spicy', 'Sweet', 'Savory'];
  
  for (let i = 0; i < count; i++) {
    const foodItem = faker.helpers.arrayElement(foodItems);
    const itemCategory = faker.helpers.arrayElement(categories);
    const commentCount = faker.number.int({ min: 0, max: 8 });
    const ratingCount = faker.number.int({ min: 5, max: 50 });
    const averageRating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
    
    items.push({
      id: faker.string.uuid(),
      name: `${faker.commerce.productAdjective()} ${foodItem.charAt(0).toUpperCase() + foodItem.slice(1)}`,
      description: faker.commerce.productDescription().substring(0, 120),
      price: parseFloat(faker.commerce.price({ min: 8, max: 35 })),
      image: `https://source.unsplash.com/featured/?indian,${foodItem}`,
      category: itemCategory,
      spicyLevel: faker.helpers.arrayElement([0, 1, 2, 3]),
      isVegetarian: faker.datatype.boolean(),
      averageRating,
      ratingCount,
      comments: generateComments(commentCount)
    });
  }
  
  return items;
};

// Get Indian-themed image for specific shop category
const getIndianShopImage = (category: ShopCategory, index: number): string => {
  // Collection of India-specific shop images for each category
  const indianImages = {
    restaurant: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?w=800&h=600&fit=crop"
    ],
    retail: [
      "https://images.unsplash.com/photo-1601565960311-3f672b35a1c2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601565580844-adbf80c50383?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582530239827-95150649530b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1569064719328-3f3e883cd3a7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800&h=600&fit=crop"
    ],
    service: [
      "https://images.unsplash.com/photo-1613987549117-13c4781ac9d2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622279488720-cf540e293b4a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598133793912-9bdcc202adfe?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613271809845-57e91d6325f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=800&h=600&fit=crop"
    ],
    streetFood: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621241441637-ea2d3f59db22?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609167830220-7164aa360951?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&h=600&fit=crop"
    ]
  };
  
  // Use the index to cycle through images, or get a random one if index is too high
  const imageArray = indianImages[category];
  const imageIndex = index % imageArray.length;
  return imageArray[imageIndex];
};

// Generate a random shop
const generateShop = (category: ShopCategory, index: number): Shop => {
  const distance = faker.number.float({ min: 0.1, max: 5, fractionDigits: 1 });
  const offersCount = faker.number.int({ min: 0, max: 5 });
  const rating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
  
  // Indian city names for shop addresses
  const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur'];
  const indianCity = faker.helpers.arrayElement(indianCities);
  
  // Indian shop names based on category
  const getIndianShopName = () => {
    const prefixes = {
      restaurant: ['Spice', 'Taj', 'Royal', 'Curry', 'Tandoor'],
      retail: ['Bazar', 'Emporium', 'Mart', 'Dukaan', 'Silk'],
      service: ['Seva', 'Quick', 'Express', 'Pro', 'Perfect'],
      streetFood: ['Chaat', 'Dhaba', 'Redi', 'Wala', 'Stall']
    };
    
    const suffixes = {
      restaurant: ['Palace', 'Kitchen', 'Darbar', 'Garden', 'House'],
      retail: ['Stores', 'Center', 'Textiles', 'Traders', 'Shop'],
      service: ['Services', 'Solutions', 'Care', 'Experts', 'Pros'],
      streetFood: ['Corner', 'Junction', 'Express', 'Point', 'Spot']
    };
    
    const prefix = faker.helpers.arrayElement(prefixes[category]);
    const suffix = faker.helpers.arrayElement(suffixes[category]);
    return `${prefix} ${suffix}`;
  };
  
  return {
    id: faker.string.uuid(),
    name: getIndianShopName(),
    description: faker.company.catchPhrase(),
    category,
    image: getIndianShopImage(category, index),
    address: `${faker.location.streetAddress()}, ${indianCity}`,
    distance,
    rating,
    ratingCount: faker.number.int({ min: 10, max: 500 }),
    openingHours: generateOpeningHours(),
    offers: generateOffers(offersCount),
    menuItems: generateMenuItems(category)
  };
};

// Generate shops for each category
export const generateShops = (): Shop[] => {
  const shops: Shop[] = [];
  
  // Generate 10 shops for each category
  categories.forEach(category => {
    for (let i = 0; i < 10; i++) {
      shops.push(generateShop(category, i));
    }
  });
  
  // Sort by distance
  shops.sort((a, b) => a.distance - b.distance);
  
  return shops;
};
