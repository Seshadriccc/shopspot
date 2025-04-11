
import { faker } from '@faker-js/faker';
import type { Shop, ShopCategory, Offer } from './mockData';

const categories: ShopCategory[] = [
  'restaurant', 
  'retail', 
  'electronics', 
  'clothing', 
  'jewelry', 
  'grocery', 
  'beauty', 
  'streetFood',
  'furniture',
  'services'
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

// Generate a random shop
const generateShop = (category: ShopCategory, index: number): Shop => {
  const distance = faker.number.float({ min: 0.1, max: 5, precision: 0.1 });
  const offersCount = faker.number.int({ min: 0, max: 5 });
  const rating = faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 });
  
  return {
    id: faker.string.uuid(),
    name: `${faker.company.name()} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: faker.company.catchPhrase(),
    category,
    image: `https://source.unsplash.com/random/800x600/?${category}/${index}`,
    address: faker.location.streetAddress({ useFullAddress: true }),
    location: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    },
    rating,
    ratingCount: faker.number.int({ min: 10, max: 500 }),
    distance,
    offers: generateOffers(offersCount),
    openingHours: generateOpeningHours(),
    contactInfo: {
      phone: faker.phone.number(),
      email: faker.internet.email(),
      website: faker.internet.url()
    }
  };
};

// Generate 10 shops for each category
export const generateShops = (): Shop[] => {
  const shops: Shop[] = [];
  
  categories.forEach(category => {
    for (let i = 0; i < 10; i++) {
      shops.push(generateShop(category, i));
    }
  });
  
  // Sort by distance
  shops.sort((a, b) => a.distance - b.distance);
  
  return shops;
};
