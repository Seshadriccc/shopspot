
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Navigation } from "lucide-react";
import type { Shop } from '@/utils/mockData';

interface MapProps {
  shops: Shop[];
  userLocation?: { lat: number; lng: number };
  onShopSelect: (shop: Shop) => void;
}

const Map = ({ shops, userLocation, onShopSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (showMap && mapRef.current && !mapLoaded) {
      // This is a placeholder for actual map implementation
      // In a real application, you would integrate with Google Maps, Mapbox, etc.
      setMapLoaded(true);
      
      const mapDiv = mapRef.current;
      mapDiv.innerHTML = "";
      mapDiv.style.backgroundColor = "#e9f5f9";
      mapDiv.style.position = "relative";
      
      // Create a simple visual representation for now
      const mapContent = document.createElement('div');
      mapContent.style.padding = "20px";
      mapContent.style.textAlign = "center";
      
      const mapText = document.createElement('p');
      mapText.textContent = `Showing ${shops.length} shops nearby`;
      mapText.style.marginBottom = "10px";
      
      const mapNote = document.createElement('p');
      mapNote.textContent = "Map visualization would appear here with shop markers";
      mapNote.style.fontSize = "14px";
      mapNote.style.color = "#666";
      
      mapContent.appendChild(mapText);
      mapContent.appendChild(mapNote);
      
      // Display shops as simple markers
      shops.forEach((shop, index) => {
        const marker = document.createElement('div');
        marker.style.position = "absolute";
        marker.style.width = "20px";
        marker.style.height = "20px";
        marker.style.borderRadius = "50%";
        marker.style.backgroundColor = "#06B6D4";
        marker.style.color = "white";
        marker.style.display = "flex";
        marker.style.alignItems = "center";
        marker.style.justifyContent = "center";
        marker.style.fontSize = "12px";
        marker.style.fontWeight = "bold";
        marker.style.cursor = "pointer";
        marker.textContent = (index + 1).toString();
        
        // Distribute markers randomly across the map for this demo
        const left = 20 + Math.random() * 60;
        const top = 20 + Math.random() * 60;
        marker.style.left = `${left}%`;
        marker.style.top = `${top}%`;
        
        marker.addEventListener('click', () => onShopSelect(shop));
        
        mapDiv.appendChild(marker);
      });
      
      // Add user location marker if available
      if (userLocation) {
        const userMarker = document.createElement('div');
        userMarker.style.position = "absolute";
        userMarker.style.width = "24px";
        userMarker.style.height = "24px";
        userMarker.style.borderRadius = "50%";
        userMarker.style.backgroundColor = "#F97316";
        userMarker.style.border = "3px solid white";
        userMarker.style.left = "50%";
        userMarker.style.top = "50%";
        userMarker.style.transform = "translate(-50%, -50%)";
        userMarker.title = "Your location";
        
        mapDiv.appendChild(userMarker);
      }
      
      mapDiv.appendChild(mapContent);
    }
  }, [shops, userLocation, showMap, mapLoaded, onShopSelect]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Nearby Locations</h2>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? "Hide Map" : "Show Map"}
          <MapIcon size={16} />
        </Button>
      </div>
      
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
