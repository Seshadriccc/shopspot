import { faker } from '@faker-js/faker';

export type ShopCategory = "restaurant" | "retail" | "service" | "streetFood";

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
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
}

// Add more shops to each category
export const mockShops: Shop[] = [
  // Restaurant category (10 shops)
  {
    id: "1",
    name: "Bella Italiano",
    description: "Authentic Italian cuisine with handmade pasta and wood-fired pizzas",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    address: "123 Main St, New York, NY 10001",
    distance: 0.3,
    rating: 4.8,
    ratingCount: 324,
    openingHours: {
      open: "11:00 AM",
      close: "10:00 PM"
    },
    offers: [
      {
        id: "101",
        title: "Family Meal Deal",
        description: "Four-course meal for 4 people with wine",
        discount: 15,
        validUntil: "2025-12-31"
      }
    ]
  },
  {
    id: "2",
    name: "Sushi Master",
    description: "Premium sushi and sashimi prepared by master chefs",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    address: "456 Broadway, New York, NY 10012",
    distance: 0.8,
    rating: 4.7,
    ratingCount: 218,
    openingHours: {
      open: "12:00 PM",
      close: "11:00 PM"
    },
    offers: [
      {
        id: "201",
        title: "Omakase Experience",
        description: "Chef's selection of premium sushi",
        discount: 10,
        validUntil: "2025-09-30"
      }
    ]
  },
  {
    id: "3",
    name: "Burger Nation",
    description: "Gourmet burgers with local, organic ingredients",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    address: "789 5th Ave, New York, NY 10022",
    distance: 1.2,
    rating: 4.5,
    ratingCount: 156,
    openingHours: {
      open: "11:00 AM",
      close: "10:00 PM"
    },
    offers: [
      {
        id: "301",
        title: "Burger + Fries + Drink",
        description: "Complete meal deal for one person",
        discount: 20,
        validUntil: "2025-08-15"
      }
    ]
  },
  {
    id: "r4",
    name: "Thai Spice",
    description: "Authentic Thai cuisine with vibrant flavors",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "321 Park Ave, New York, NY 10022",
    distance: 1.5,
    rating: 4.6,
    ratingCount: 187,
    openingHours: {
      open: "11:30 AM",
      close: "10:30 PM"
    },
    offers: [
      {
        id: "r401",
        title: "Lunch Special",
        description: "Any entree with soup and appetizer",
        discount: 15,
        validUntil: "2025-10-15"
      }
    ]
  },
  {
    id: "r5",
    name: "Mediterranean Delight",
    description: "Fresh Mediterranean cuisine with a modern twist",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "555 Lexington Ave, New York, NY 10022",
    distance: 0.9,
    rating: 4.7,
    ratingCount: 221,
    openingHours: {
      open: "11:00 AM",
      close: "11:00 PM"
    },
    offers: [
      {
        id: "r501",
        title: "Mezze Platter",
        description: "Assortment of Mediterranean appetizers",
        discount: 20,
        validUntil: "2025-11-30"
      }
    ]
  },
  {
    id: "r6",
    name: "Taqueria El Sol",
    description: "Authentic Mexican tacos and fresh margaritas",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "187 7th Ave, New York, NY 10011",
    distance: 1.3,
    rating: 4.5,
    ratingCount: 178,
    openingHours: {
      open: "12:00 PM",
      close: "11:00 PM"
    },
    offers: [
      {
        id: "r601",
        title: "Taco Tuesday",
        description: "50% off all tacos on Tuesdays",
        discount: 50,
        validUntil: "2025-12-31"
      }
    ]
  },
  {
    id: "r7",
    name: "Steakhouse Prime",
    description: "Premium aged steaks and fine wines",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1594041680138-da57e5a612f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "902 Broadway, New York, NY 10010",
    distance: 1.7,
    rating: 4.8,
    ratingCount: 312,
    openingHours: {
      open: "5:00 PM",
      close: "11:30 PM"
    },
    offers: [
      {
        id: "r701",
        title: "Wine Pairing",
        description: "Free glass of wine with premium steak",
        discount: 25,
        validUntil: "2025-09-15"
      }
    ]
  },
  {
    id: "r8",
    name: "Dim Sum Palace",
    description: "Traditional dim sum and Cantonese specialties",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "45 Chinatown Square, New York, NY 10013",
    distance: 2.1,
    rating: 4.4,
    ratingCount: 189,
    openingHours: {
      open: "9:00 AM",
      close: "9:00 PM"
    },
    offers: [
      {
        id: "r801",
        title: "Weekend Brunch",
        description: "All-you-can-eat dim sum",
        discount: 15,
        validUntil: "2025-08-30"
      }
    ]
  },
  {
    id: "r9",
    name: "Indian Spice Route",
    description: "Flavorful Indian cuisine from various regions",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "678 2nd Ave, New York, NY 10016",
    distance: 1.4,
    rating: 4.6,
    ratingCount: 223,
    openingHours: {
      open: "11:30 AM",
      close: "10:30 PM"
    },
    offers: [
      {
        id: "r901",
        title: "Curry Feast",
        description: "Three curry dishes with rice and naan",
        discount: 20,
        validUntil: "2025-10-31"
      }
    ]
  },
  {
    id: "r10",
    name: "Southern Comfort",
    description: "Home-style Southern cooking and comfort food",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1628294895950-9805252673c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "234 W 4th St, New York, NY 10014",
    distance: 0.7,
    rating: 4.5,
    ratingCount: 156,
    openingHours: {
      open: "11:00 AM",
      close: "9:30 PM"
    },
    offers: [
      {
        id: "r1001",
        title: "Family Style Dinner",
        description: "Shared platters for 4-6 people",
        discount: 15,
        validUntil: "2025-11-15"
      }
    ]
  },
  
  // Retail category (10 shops)
  {
    id: "4",
    name: "Urban Threads",
    description: "Contemporary fashion with sustainable practices",
    category: "retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmclMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    address: "222 Soho Square, New York, NY 10012",
    distance: 0.5,
    rating: 4.6,
    ratingCount: 185,
    openingHours: {
      open: "10:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "401",
        title: "Summer Collection",
        description: "New arrivals at special prices",
        discount: 25,
        validUntil: "2025-07-31"
      }
    ]
  },
  {
    id: "5",
    name: "Tech Haven",
    description: "Latest gadgets and tech accessories",
    category: "retail",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    address: "888 6th Ave, New York, NY 10001",
    distance: 1.0,
    rating: 4.4,
    ratingCount: 132,
    openingHours: {
      open: "9:00 AM",
      close: "9:00 PM"
    },
    offers: [
      {
        id: "501",
        title: "Smartphone Accessories",
        description: "Buy 2 get 1 free on all accessories",
        discount: 33,
        validUntil: "2025-06-30"
      }
    ]
  },
  {
    id: "rt3",
    name: "Home Elegance",
    description: "Stylish home decor and furniture",
    category: "retail",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "435 Madison Ave, New York, NY 10022",
    distance: 1.2,
    rating: 4.7,
    ratingCount: 198,
    openingHours: {
      open: "10:00 AM",
      close: "7:00 PM"
    },
    offers: [
      {
        id: "rt301",
        title: "Living Room Collection",
        description: "Special pricing on furniture sets",
        discount: 20,
        validUntil: "2025-08-31"
      }
    ]
  },
  {
    id: "rt4",
    name: "Bookworm's Paradise",
    description: "Independent bookstore with rare finds",
    category: "retail",
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "112 E 23rd St, New York, NY 10010",
    distance: 0.8,
    rating: 4.8,
    ratingCount: 245,
    openingHours: {
      open: "9:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "rt401",
        title: "Book Club Special",
        description: "Buy 5 books, get the 6th free",
        discount: 17,
        validUntil: "2025-12-31"
      }
    ]
  },
  {
    id: "rt5",
    name: "Outdoor Adventures",
    description: "Everything for hiking, camping, and outdoor activities",
    category: "retail",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "567 W 42nd St, New York, NY 10036",
    distance: 1.5,
    rating: 4.5,
    ratingCount: 176,
    openingHours: {
      open: "10:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "rt501",
        title: "Camping Gear",
        description: "Complete camping set at special price",
        discount: 30,
        validUntil: "2025-07-15"
      }
    ]
  },
  {
    id: "rt6",
    name: "Vinyl Revival",
    description: "Classic and new release vinyl records",
    category: "retail",
    image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "87 Greenwich Ave, New York, NY 10014",
    distance: 0.6,
    rating: 4.6,
    ratingCount: 189,
    openingHours: {
      open: "11:00 AM",
      close: "7:00 PM"
    },
    offers: [
      {
        id: "rt601",
        title: "Classic Rock Collection",
        description: "Buy 3 records, get 15% off",
        discount: 15,
        validUntil: "2025-09-30"
      }
    ]
  },
  {
    id: "rt7",
    name: "Artisan Crafts",
    description: "Handmade crafts and gifts from local artisans",
    category: "retail",
    image: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "324 Spring St, New York, NY 10013",
    distance: 1.1,
    rating: 4.7,
    ratingCount: 215,
    openingHours: {
      open: "10:00 AM",
      close: "6:00 PM"
    },
    offers: [
      {
        id: "rt701",
        title: "Local Artists Showcase",
        description: "Special pricing on featured items",
        discount: 20,
        validUntil: "2025-08-15"
      }
    ]
  },
  {
    id: "rt8",
    name: "Beauty Haven",
    description: "Premium beauty products and cosmetics",
    category: "retail",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "712 5th Ave, New York, NY 10019",
    distance: 1.3,
    rating: 4.5,
    ratingCount: 167,
    openingHours: {
      open: "9:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "rt801",
        title: "Skincare Bundle",
        description: "Complete skincare routine products",
        discount: 25,
        validUntil: "2025-10-31"
      }
    ]
  },
  {
    id: "rt9",
    name: "Gourmet Pantry",
    description: "Specialty foods and ingredients from around the world",
    category: "retail",
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "98 7th Ave, New York, NY 10011",
    distance: 0.9,
    rating: 4.8,
    ratingCount: 223,
    openingHours: {
      open: "8:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "rt901",
        title: "Imported Delicacies",
        description: "Special selection of gourmet items",
        discount: 15,
        validUntil: "2025-11-15"
      }
    ]
  },
  {
    id: "rt10",
    name: "Pet Paradise",
    description: "Premium pet supplies and accessories",
    category: "retail",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "256 E 14th St, New York, NY 10003",
    distance: 1.0,
    rating: 4.6,
    ratingCount: 189,
    openingHours: {
      open: "9:00 AM",
      close: "7:00 PM"
    },
    offers: [
      {
        id: "rt1001",
        title: "Pet Care Bundle",
        description: "Essential pet care products",
        discount: 20,
        validUntil: "2025-12-15"
      }
    ]
  },

  // Service category (10 shops)
  {
    id: "6",
    name: "Zenith Spa",
    description: "Luxury spa treatments and massage therapy",
    category: "service",
    image: "https://images.unsplash.com/photo-1591343395063-e96e44622d1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNwYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    address: "333 E 44th St, New York, NY 10017",
    distance: 1.1,
    rating: 4.9,
    ratingCount: 276,
    openingHours: {
      open: "9:00 AM",
      close: "9:00 PM"
    },
    offers: [
      {
        id: "601",
        title: "Ultimate Relaxation Package",
        description: "90-minute massage with facial",
        discount: 20,
        validUntil: "2025-06-15"
      }
    ]
  },
  {
    id: "7",
    name: "Quick Repairs",
    description: "Fast and reliable electronics repair service",
    category: "service",
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    address: "111 W 57th St, New York, NY 10019",
    distance: 1.5,
    rating: 4.3,
    ratingCount: 142,
    openingHours: {
      open: "8:00 AM",
      close: "7:00 PM"
    },
    offers: [
      {
        id: "701",
        title: "Phone Screen Replacement",
        description: "Discounted screen repairs for all models",
        discount: 15,
        validUntil: "2025-05-31"
      }
    ]
  },
  {
    id: "sv3",
    name: "Precision Auto Care",
    description: "Expert automotive repair and maintenance",
    category: "service",
    image: "https://images.unsplash.com/photo-1486127607337-e95b2ceb299d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "543 10th Ave, New York, NY 10018",
    distance: 2.0,
    rating: 4.5,
    ratingCount: 178,
    openingHours: {
      open: "7:00 AM",
      close: "6:00 PM"
    },
    offers: [
      {
        id: "sv301",
        title: "Summer Maintenance",
        description: "Complete car check-up and fluid change",
        discount: 25,
        validUntil: "2025-08-31"
      }
    ]
  },
  {
    id: "sv4",
    name: "Clean & Fresh Laundry",
    description: "Professional dry cleaning and laundry service",
    category: "service",
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "267 E 10th St, New York, NY 10009",
    distance: 0.7,
    rating: 4.4,
    ratingCount: 156,
    openingHours: {
      open: "7:00 AM",
      close: "8:00 PM"
    },
    offers: [
      {
        id: "sv401",
        title: "Business Attire Special",
        description: "Suits and formal wear cleaning",
        discount: 20,
        validUntil: "2025-07-15"
      }
    ]
  },
  {
    id: "sv5",
    name: "Stellar Photography",
    description: "Professional photography for all occasions",
    category: "service",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "421 W 13th St, New York, NY 10014",
    distance: 1.3,
    rating: 4.8,
    ratingCount: 209,
    openingHours: {
      open: "10:00 AM",
      close: "6:00 PM"
    },
    offers: [
      {
        id: "sv501",
        title: "Family Portrait Package",
        description: "Studio session with prints",
        discount: 30,
        validUntil: "2025-11-30"
      }
    ]
  },
  {
    id: "sv6",
    name: "Urban Fitness",
    description: "Modern gym with personal training services",
    category: "service",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "78 5th Ave, New York, NY 10011",
    distance: 0.8,
    rating: 4.6,
    ratingCount: 187,
    openingHours: {
      open: "6:00 AM",
      close: "10:00 PM"
    },
    offers: [
      {
        id: "sv601",
        title: "Personal Training",
        description: "5-session package with fitness assessment",
        discount: 20,
        validUntil: "2025-09-15"
      }
    ]
  },
  {
    id: "sv7",
    name: "Digital Solutions",
    description: "Web design and digital marketing services",
    category: "service",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "356 Park Ave S, New York, NY 10010",
    distance: 1.1,
    rating: 4.7,
    ratingCount: 143,
    openingHours: {
      open: "9:00 AM",
      close: "6:00 PM"
    },
    offers: [
      {
        id: "sv701",
        title: "Small Business Web Package",
        description: "Website design with SEO optimization",
        discount: 15,
        validUntil: "2025-10-31"
      }
    ]
  },
  {
    id: "sv8",
    name: "Perfect Smile Dental",
    description: "Comprehensive dental care for the whole family",
    category: "service",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "234 E 34th St, New York, NY 10016",
    distance: 1.4,
    rating: 4.8,
    ratingCount: 231,
    openingHours: {
      open: "8:00 AM",
      close: "5:00 PM"
    },
    offers: [
      {
        id: "sv801",
        title: "Dental Cleaning",
        description: "Comprehensive cleaning and check-up",
        discount: 25,
        validUntil: "2025-08-31"
      }
    ]
  },
  {
    id: "sv9",
    name: "Expert Tax Advisors",
    description: "Professional tax planning and preparation",
    category: "service",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    address: "548 Broadway, New York, NY 10012",
    distance: 0.9,
    rating: 4.5,
    ratingCount: 1
