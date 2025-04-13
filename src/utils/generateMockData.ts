import { faker } from '@faker-js/faker';
import type { Shop, ShopCategory, Offer, MenuItem, Comment } from './mockData';

// Enhanced categories with more specific characteristics
const categories: ShopCategory[] = [
  'restaurant', 
  'retail', 
  'service', 
  'streetFood'
];

// Comprehensive Indian-specific shop naming strategy
const shopNameGenerators = {
  restaurant: {
    prefixes: ['Spice', 'Taj', 'Royal', 'Curry', 'Tandoor', 'Masala', 'Delhi', 'Mumbai', 'Deccan', 'Saffron'],
    suffixes: ['Palace', 'Kitchen', 'Darbar', 'Garden', 'House', 'Pavilion', 'Express', 'Delight', 'Rasoi', 'Bhavan']
  },
  retail: {
    prefixes: ['Bazar', 'Emporium', 'Mart', 'Dukaan', 'Silk', 'Fabindia', 'Mysore', 'Rajasthani', 'Heritage', 'Swadeshi'],
    suffixes: ['Stores', 'Traders', 'Textiles', 'Collections', 'Market', 'Bazaar', 'Emporium', 'Gallery', 'Crafts', 'Boutique']
  },
  service: {
    prefixes: ['Seva', 'Quick', 'Express', 'Pro', 'Perfect', 'Bharath', 'Indian', 'Metro', 'City', 'Digital'],
    suffixes: ['Services', 'Solutions', 'Care', 'Experts', 'Hub', 'Network', 'Point', 'Connect', 'Works', 'Assist']
  },
  streetFood: {
    prefixes: ['Chaat', 'Dhaba', 'Redi', 'Wala', 'Stall', 'Delhi', 'Bombay', 'Punjabi', 'Desi', 'Masti'],
    suffixes: ['Corner', 'Express', 'Point', 'Street', 'Hub', 'Cart', 'Thela', 'Chowk', 'Nukkad', 'Patri']
  }
};

// Sophisticated image diversity strategy
const indianShopImages = {
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1574653853027-5382a3d23a7d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602023039928-7af5a2f000fa?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1600891964599-f61f3a3b7b2b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1624001934833-b238732edf28?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop"
  ],
  retail: [
    "https://images.unsplash.com/photo-1601565580844-adbf80c50383?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582530239827-95150649530b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1608303588026-884cbd42f3eb?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605651202774-7d573f2174f5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1601751818941-571144562ff8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1570857502809-08184874388e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586866109617-211e56518c45?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1599896345024-d01b143c8eba?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596262583767-bbd226af4eab?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567401533-6e6a62bd8b49?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555529771-7888783a18d3?w=800&h=600&fit=crop"
  ],
  service: [
    "https://images.unsplash.com/photo-1613987549117-13c4781ac9d2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1622279488720-cf540e293b4a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1533142266415-ac591a4deae9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1536650135175-9b3cd4f86884?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606166325695-af56768282b5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1661282039231-5a9745a2159e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1613271809845-57e91d6325f1?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1629995249259-bba640f9001a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1616626229291-9682879e8070?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1595238613856-5b28419b2b27?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1562078809-b5b4916d3a2c?w=800&h=600&fit=crop"
  ],
  streetFood: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621241441637-ea2d3f59db22?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1589778655375-3c70785cd832?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596458397260-255807e5d32c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583668496597-b0ec8097ce36?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1602273660127-a0000560a4c1?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
  ]
};

// Enhanced unique image generation
const generateUniqueImage = (category: ShopCategory, index: number, totalShops: number) => {
  const images = indianShopImages[category];
  // Sophisticated distribution algorithm
  const imageIndex = (index * 11 + (categories.indexOf(category) * 17)) % images.length;
  return images[imageIndex];
};

// Comprehensive shop name generation
const generateShopName = (category: ShopCategory, index: number): string => {
  const { prefixes, suffixes } = shopNameGenerators[category];
  const prefixIndex = (index * 7) % prefixes.length;
  const suffixIndex = (index * 13) % suffixes.length;
  
  return `${prefixes[prefixIndex]} ${suffixes[suffixIndex]}`;
};

// Advanced shop generation with rich contextual data
const generateShop = (category: ShopCategory, index: number, totalShops: number): Shop => {
  const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Kochi', 'Chandigarh', 'Goa', 'Indore', 'Bhopal'];
  const cityIndex = (index + categories.indexOf(category)) % indianCities.length;
  
  const distance = faker.number.float({ min: 0.1, max: 5, fractionDigits: 1 });
  const offersCount = faker.number.int({ min: 0, max: 5 });
  const rating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
  
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
  const generateMenuItems = (category: ShopCategory, shopIndex: number): MenuItem[] => {
    if (category !== 'restaurant' && category !== 'streetFood') return [];
    
    const count = faker.number.int({ min: 8, max: 12 });
    const items = [];
    
    // Indian specific food items
    const foodTypes = {
      restaurant: ['biryani', 'curry', 'thali', 'dosa', 'paneer', 'naan', 'butter-chicken', 'tandoori', 'rogan-josh', 'malai-kofta'],
      streetFood: ['pani-puri', 'vada-pav', 'chaat', 'samosa', 'kachori', 'bhel-puri', 'pav-bhaji', 'jalebi', 'aloo-tikki', 'chole-bhature']
    };
    
    const foodType = category === 'restaurant' ? 'restaurant' : 'streetFood';
    const foodItems = foodTypes[foodType];
    
    // Indian cuisine categories
    const categories = category === 'restaurant' 
      ? ['Starters', 'Main Course', 'Breads', 'Desserts'] 
      : ['Popular', 'Spicy', 'Sweet', 'Savory'];
    
    for (let i = 0; i < count; i++) {
      const foodItem = foodItems[i % foodItems.length]; // Ensure unique food items
      const itemCategory = faker.helpers.arrayElement(categories);
      const commentCount = faker.number.int({ min: 0, max: 8 });
      const ratingCount = faker.number.int({ min: 5, max: 50 });
      const averageRating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
      
      // Create a unique image identifier using shop index and item index
      const uniqueId = (shopIndex * 100) + i;
      
      items.push({
        id: faker.string.uuid(),
        name: `${faker.commerce.productAdjective()} ${foodItem.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        description: faker.commerce.productDescription().substring(0, 120),
        price: parseFloat(faker.commerce.price({ min: 8, max: 35 })),
        image: `https://source.unsplash.com/featured/?indian,${foodItem},food&${uniqueId}`, // More unique parameter
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
  
  return {
    id: faker.string.uuid(),
    name: generateShopName(category, index),
    description: faker.company.catchPhrase(),
    category,
    image: generateUniqueImage(category, index, totalShops),
    address: `${faker.location.streetAddress()}, ${indianCities[cityIndex]}`,
    distance,
    rating,
    ratingCount: faker.number.int({ min: 10, max: 500 }),
    openingHours: generateOpeningHours(),
    offers: generateOffers(offersCount),
    menuItems: generateMenuItems(category, index)
  };
};

// Comprehensive shops generation
export const generateShops = (): Shop[] => {
  const shopsPerCategory = 10; // Increased variety
  const totalShops = categories.length * shopsPerCategory;
  const shops: Shop[] = [];
  
  categories.forEach(category => {
    for (let i = 0; i < shopsPerCategory; i++) {
      shops.push(generateShop(category, i, totalShops));
    }
  });
  
  return shops.sort((a, b) => a.distance - b.distance);
};
