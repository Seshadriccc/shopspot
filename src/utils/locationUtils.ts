export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise(async (resolve, reject) => {
    // Check if we have cached location
    const cachedLocation = localStorage.getItem('userLocation');
    const cacheTimestamp = localStorage.getItem('locationTimestamp');
    
    // Use cached location if it's less than 10 minutes old
    if (cachedLocation && cacheTimestamp) {
      const cachedData = JSON.parse(cachedLocation);
      const timestamp = parseInt(cacheTimestamp, 10);
      const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      if (Date.now() - timestamp < tenMinutes) {
        console.log('Using cached location:', cachedData);
        resolve(cachedData);
        return;
      }
    }
    
    // No valid cache, request new location
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    // Try to get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Cache the location
        localStorage.setItem('userLocation', JSON.stringify(position));
        localStorage.setItem('locationTimestamp', Date.now().toString());
        console.log('Got new location:', position);
        resolve(position);
      },
      (error) => {
        console.log('Geolocation error:', error.message);
        let errorMessage = 'Unknown location error';
        
        // Provide more descriptive error messages
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          case error.UNKNOWN_ERROR:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        console.warn(`Location error: ${errorMessage}`);
        
        // Provide a default location (Bangalore, India coordinates)
        const defaultPosition = {
          coords: {
            latitude: 12.9716,
            longitude: 77.5946,
            accuracy: 50,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        } as GeolocationPosition;
        
        // Still cache this default location but mark it as fallback
        localStorage.setItem('userLocation', JSON.stringify(defaultPosition));
        localStorage.setItem('locationTimestamp', Date.now().toString());
        localStorage.setItem('isDefaultLocation', 'true');
        
        resolve(defaultPosition);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 60000 // Allow positions up to 1 minute old
      }
    );
  });
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Get address from coordinates using reverse geocoding
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  // Check for cached address
  const cacheKey = `address_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  const cachedAddress = localStorage.getItem(cacheKey);
  
  if (cachedAddress) {
    return cachedAddress;
  }
  
  try {
    // First try OSM Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en', // Request English results
          'User-Agent': 'ShopSpot App (demo)' // Identify our app
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch address from primary source');
    }
    
    const data = await response.json();
    
    let formattedAddress = 'Unknown location';
    
    if (data && data.address) {
      // Create a more readable address string
      const address = data.address;
      const parts = [];
      
      // Build a nicely formatted address
      if (address.road || address.pedestrian || address.street) {
        parts.push(address.road || address.pedestrian || address.street);
      }
      
      if (address.suburb) {
        parts.push(address.suburb);
      }
      
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village);
      }
      
      if (address.state_district) {
        parts.push(address.state_district);
      }
      
      if (address.state) {
        parts.push(address.state);
      }
      
      if (address.postcode) {
        parts.push(address.postcode);
      }
      
      if (parts.length > 0) {
        formattedAddress = parts.join(', ');
      } else if (data.display_name) {
        formattedAddress = data.display_name;
      }
    } else if (data && data.display_name) {
      formattedAddress = data.display_name;
    }
    
    // Cache the address
    localStorage.setItem(cacheKey, formattedAddress);
    return formattedAddress;
  } catch (primaryError) {
    console.error('Error with primary geocoding service:', primaryError);
    
    // Fallback to a simpler format if the detailed parsing fails
    try {
      const fallbackResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.display_name) {
          // Cache the address
          localStorage.setItem(cacheKey, fallbackData.display_name);
          return fallbackData.display_name;
        }
      }
    } catch (fallbackError) {
      console.error('Error with fallback geocoding:', fallbackError);
    }
    
    // If all fails, return approximate coordinates
    const approxAddress = `Location near ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    localStorage.setItem(cacheKey, approxAddress);
    return approxAddress;
  }
};

// Check if we're using a default location
export const isUsingDefaultLocation = (): boolean => {
  return localStorage.getItem('isDefaultLocation') === 'true';
};

// Clear location cache to force refresh
export const clearLocationCache = (): void => {
  localStorage.removeItem('userLocation');
  localStorage.removeItem('locationTimestamp');
  localStorage.removeItem('isDefaultLocation');
  
  // Also clear any cached addresses
  const addressKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('address_')) {
      addressKeys.push(key);
    }
  }
  
  addressKeys.forEach(key => localStorage.removeItem(key));
};
