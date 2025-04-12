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
  
  const foodTypes = {
    restaurant: ['pasta', 'steak', 'salad', 'seafood', 'chicken', 'pizza'],
    streetFood: ['taco', 'burger', 'sandwich', 'hotdog', 'kebab', 'noodles']
  };
  
  const foodType = category === 'restaurant' ? 'restaurant' : 'streetFood';
  const foodItems = foodTypes[foodType];
  
  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];
  
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
      image: `https://source.unsplash.com/featured/?${foodItem},food`,
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

// Generate a random shop
const generateShop = (category: ShopCategory, index: number): Shop => {
  const distance = faker.number.float({ min: 0.1, max: 5, fractionDigits: 1 });
  const offersCount = faker.number.int({ min: 0, max: 5 });
  const rating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
  
  // Correct the image category to match ShopCategory
  let imageCategory = category;
  if (category === 'streetFood') {
    imageCategory = 'street-food';
  }
  
  return {
    id: faker.string.uuid(),
    name: `${faker.company.name()} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: faker.company.catchPhrase(),
    category,
    image: `https://source.unsplash.com/featured/?${imageCategory},shop`,
    address: faker.location.streetAddress({ useFullAddress: true }),
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
