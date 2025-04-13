
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon, Navigation, MapPin } from "lucide-react";
import type { Shop } from '@/utils/mockData';
import { getAddressFromCoordinates } from '@/utils/locationUtils';
import { useToast } from "@/hooks/use-toast";

interface MapProps {
  shops: Shop[];
  userLocation?: { lat: number; lng: number };
  onShopSelect: (shop: Shop) => void;
}

const Map = ({ shops, userLocation, onShopSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current address based on coordinates
  useEffect(() => {
    if (userLocation) {
      const fetchAddress = async () => {
        try {
          const address = await getAddressFromCoordinates(userLocation.lat, userLocation.lng);
          setCurrentAddress(address);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
      
      fetchAddress();
    }
  }, [userLocation]);

  useEffect(() => {
    if (showMap && mapRef.current && !mapLoaded) {
      // This is an enhanced placeholder for actual map implementation
      // In a real application, you would integrate with Google Maps, Mapbox, etc.
      setMapLoaded(true);
      
      const mapDiv = mapRef.current;
      mapDiv.innerHTML = "";
      mapDiv.style.backgroundColor = "#e9f5f9";
      mapDiv.style.position = "relative";
      mapDiv.style.backgroundImage = "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=600&fit=crop&q=80')";
      mapDiv.style.backgroundSize = "cover";
      mapDiv.style.backgroundPosition = "center";
      
      // Add semi-transparent overlay for better readability
      const overlay = document.createElement('div');
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
      mapDiv.appendChild(overlay);
      
      // Create a simple visual representation for now
      const mapContent = document.createElement('div');
      mapContent.style.padding = "20px";
      mapContent.style.textAlign = "center";
      mapContent.style.position = "relative";
      mapContent.style.zIndex = "1";
      
      const mapText = document.createElement('p');
      mapText.textContent = `Showing ${shops.length} shops nearby`;
      mapText.style.marginBottom = "10px";
      mapText.style.fontWeight = "bold";
      
      const mapNote = document.createElement('p');
      if (currentAddress) {
        mapNote.textContent = `Your location: ${currentAddress}`;
      } else {
        mapNote.textContent = "Using default location (map visualization)";
      }
      mapNote.style.fontSize = "14px";
      mapNote.style.color = "#666";
      mapNote.style.marginBottom = "20px";
      
      mapContent.appendChild(mapText);
      mapContent.appendChild(mapNote);
      
      // Display shops as better looking markers
      shops.forEach((shop, index) => {
        const markerContainer = document.createElement('div');
        markerContainer.style.position = "absolute";
        markerContainer.style.cursor = "pointer";
        
        // Distribute markers randomly across the map for this demo
        const left = 10 + Math.random() * 80;
        const top = 20 + Math.random() * 60;
        markerContainer.style.left = `${left}%`;
        markerContainer.style.top = `${top}%`;
        
        // Create marker
        const marker = document.createElement('div');
        marker.style.width = "30px";
        marker.style.height = "30px";
        marker.style.borderRadius = "50%";
        marker.style.backgroundColor = "#FFF";
        marker.style.border = "3px solid #06B6D4";
        marker.style.display = "flex";
        marker.style.alignItems = "center";
        marker.style.justifyContent = "center";
        marker.style.fontSize = "12px";
        marker.style.fontWeight = "bold";
        marker.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        marker.style.color = "#06B6D4";
        marker.textContent = (index + 1).toString();
        
        // Add tooltip on hover
        const tooltip = document.createElement('div');
        tooltip.style.position = "absolute";
        tooltip.style.top = "-45px";
        tooltip.style.left = "50%";
        tooltip.style.transform = "translateX(-50%)";
        tooltip.style.backgroundColor = "white";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.fontSize = "12px";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.2s";
        tooltip.textContent = `${shop.name} (${shop.distance}km)`;
        
        // Show tooltip on hover
        markerContainer.addEventListener('mouseenter', () => {
          tooltip.style.opacity = "1";
        });
        
        markerContainer.addEventListener('mouseleave', () => {
          tooltip.style.opacity = "0";
        });
        
        // Marker click to select shop
        markerContainer.addEventListener('click', () => {
          onShopSelect(shop);
          
          // Highlight selected marker
          marker.style.backgroundColor = "#06B6D4";
          marker.style.color = "white";
          
          // Reset after a moment
          setTimeout(() => {
            marker.style.backgroundColor = "#FFF";
            marker.style.color = "#06B6D4";
          }, 1000);
        });
        
        markerContainer.appendChild(marker);
        markerContainer.appendChild(tooltip);
        overlay.appendChild(markerContainer);
      });
      
      // Add user location marker if available
      if (userLocation) {
        const userMarkerContainer = document.createElement('div');
        userMarkerContainer.style.position = "absolute";
        userMarkerContainer.style.left = "50%";
        userMarkerContainer.style.top = "50%";
        userMarkerContainer.style.transform = "translate(-50%, -50%)";
        userMarkerContainer.style.zIndex = "10";
        
        const userMarker = document.createElement('div');
        userMarker.style.width = "36px";
        userMarker.style.height = "36px";
        userMarker.style.borderRadius = "50%";
        userMarker.style.backgroundColor = "#F97316";
        userMarker.style.border = "4px solid white";
        userMarker.style.boxShadow = "0 0 0 2px rgba(249, 115, 22, 0.4), 0 4px 8px rgba(0,0,0,0.2)";
        userMarker.title = "Your location";
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = "absolute";
        ripple.style.top = "-8px";
        ripple.style.left = "-8px";
        ripple.style.right = "-8px";
        ripple.style.bottom = "-8px";
        ripple.style.borderRadius = "50%";
        ripple.style.border = "3px solid #F97316";
        ripple.style.opacity = "0";
        ripple.style.animation = "ripple 2s infinite";
        
        // Add keyframes for ripple animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes ripple {
            0% {
              transform: scale(1);
              opacity: 0.4;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
        
        userMarkerContainer.appendChild(userMarker);
        userMarkerContainer.appendChild(ripple);
        overlay.appendChild(userMarkerContainer);
        
        // Add user location tooltip
        const userTooltip = document.createElement('div');
        userTooltip.style.position = "absolute";
        userTooltip.style.bottom = "-45px";
        userTooltip.style.left = "50%";
        userTooltip.style.transform = "translateX(-50%)";
        userTooltip.style.backgroundColor = "#F97316";
        userTooltip.style.color = "white";
        userTooltip.style.padding = "5px 10px";
        userTooltip.style.borderRadius = "4px";
        userTooltip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        userTooltip.style.whiteSpace = "nowrap";
        userTooltip.style.fontSize = "12px";
        userTooltip.textContent = "Your Location";
        
        userMarkerContainer.appendChild(userTooltip);
      }
      
      overlay.appendChild(mapContent);
    }
  }, [shops, userLocation, showMap, mapLoaded, onShopSelect, currentAddress]);

  const handleRefreshLocation = async () => {
    try {
      // Request location access again
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              toast({
                title: "Location Updated",
                description: "Successfully retrieved your current location.",
              });
              
              // Reload the page to refresh everything with new location
              window.location.reload();
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Error",
              description: "Couldn't access your location. Please check your browser settings.",
              variant: "destructive",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Geolocation is not supported by your browser.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing location:", error);
      toast({
        title: "Error",
        description: "Something went wrong when trying to update your location.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Nearby Locations</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={handleRefreshLocation}
          >
            <Compass size={16} />
            Refresh Location
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Hide Map" : "Show Map"}
            <MapIcon size={16} />
          </Button>
        </div>
      </div>
      
      {currentAddress && (
        <div className="bg-muted/30 p-3 rounded-lg mb-4 flex items-center gap-2">
          <MapPin size={16} className="text-brand-teal flex-shrink-0" />
          <p className="text-sm text-muted-foreground truncate">{currentAddress}</p>
        </div>
      )}
      
      {showMap && (
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden border mb-6">
          <div ref={mapRef} className="w-full h-full">
            <div className="flex items-center justify-center h-full bg-muted/30">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
