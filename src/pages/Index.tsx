
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ShopCard from "@/components/ShopCard";
import Map from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Phone, Clock, ExternalLink } from "lucide-react";
import { mockShops, type Shop, type ShopCategory } from "@/utils/mockData";
import { getCurrentLocation, formatDistance } from "@/utils/locationUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [filteredShops, setFilteredShops] = useState<Shop[]>(mockShops);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast({
          title: "Location Found",
          description: "Using your current location to find nearby shops.",
        });
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Couldn't access your location. Using default location instead.",
          variant: "destructive",
        });
      }
    };

    getLocation();
  }, [toast]);

  useEffect(() => {
    // Filter shops based on category and search term
    let filtered = [...shops];
    
    if (selectedCategory) {
      filtered = filtered.filter(shop => shop.category === selectedCategory);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        shop => 
          shop.name.toLowerCase().includes(search) ||
          shop.description.toLowerCase().includes(search) ||
          shop.category.toLowerCase().includes(search) ||
          shop.offers.some(offer => 
            offer.title.toLowerCase().includes(search) ||
            offer.description.toLowerCase().includes(search)
          )
      );
    }
    
    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    
    setFilteredShops(filtered);
  }, [shops, selectedCategory, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (category: ShopCategory | null) => {
    setSelectedCategory(category);
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleCloseShopDetails = () => {
    setSelectedShop(null);
  };

  const handleBookNow = (shop: Shop) => {
    toast({
      title: "Booking Confirmed",
      description: `Your order has been prebooked at ${shop.name}. You'll receive confirmation shortly.`,
    });
    handleCloseShopDetails();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Discover Local Deals</h1>
          <p className="text-muted-foreground text-center mb-6">
            Find the best offers from local businesses near you
          </p>
          
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <CategoryFilter onSelect={handleCategorySelect} selected={selectedCategory} />
        </section>
        
        <Map 
          shops={filteredShops} 
          userLocation={userLocation} 
          onShopSelect={handleShopSelect} 
        />
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {selectedCategory 
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Deals` 
                : "All Nearby Deals"}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredShops.length} {filteredShops.length === 1 ? 'result' : 'results'}
            </div>
          </div>
          
          {filteredShops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No shops found matching your criteria</p>
              <Button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <ShopCard 
                  key={shop.id} 
                  shop={shop} 
                  onClick={handleShopSelect} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Shop Details Modal */}
      <Dialog open={!!selectedShop} onOpenChange={handleCloseShopDetails}>
        {selectedShop && (
          <DialogContent className="sm:max-w-[500px] overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedShop.name}</DialogTitle>
              <DialogDescription className="flex items-center text-sm">
                <Badge className="mr-2 bg-muted text-muted-foreground">
                  {selectedShop.category.charAt(0).toUpperCase() + selectedShop.category.slice(1)}
                </Badge>
                <div className="flex items-center text-amber-500">
                  <Star className="fill-current h-4 w-4 mr-1" />
                  <span>{selectedShop.rating}</span>
                  <span className="text-muted-foreground ml-1">({selectedShop.ratingCount})</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-4">
              <img 
                src={selectedShop.image} 
                alt={selectedShop.name} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedShop.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedShop.address}</p>
                    <p className="text-sm text-muted-foreground">{formatDistance(selectedShop.distance)} away</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock size={18} className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedShop.openingHours.open} - {selectedShop.openingHours.close}
                    </p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="offers">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="offers">Offers & Deals</TabsTrigger>
                  <TabsTrigger value="info">Shop Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="offers" className="space-y-4 pt-4">
                  {selectedShop.offers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No current offers available</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedShop.offers.map((offer) => (
                        <div key={offer.id} className="border rounded-md p-4 relative">
                          <div className="absolute top-2 right-2 bg-brand-coral text-white px-2 py-1 rounded-md text-xs font-bold">
                            {offer.discount}% OFF
                          </div>
                          <h4 className="font-bold text-lg mb-1">{offer.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                          <p className="text-xs text-muted-foreground">Valid until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedShop.category === 'restaurant' || selectedShop.category === 'streetFood' ? (
                    <Button 
                      className="w-full bg-brand-coral hover:bg-brand-coral/90 mt-4"
                      onClick={() => handleBookNow(selectedShop)}
                    >
                      Prebook Order
                    </Button>
                  ) : (
                    <Button 
                      className="w-full mt-4"
                      onClick={handleCloseShopDetails}
                    >
                      Visit Shop
                    </Button>
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm text-muted-foreground">{selectedShop.description}</p>
                    </div>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Phone size={16} />
                      Contact Shop
                    </Button>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink size={16} />
                      Visit Website
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Index;
