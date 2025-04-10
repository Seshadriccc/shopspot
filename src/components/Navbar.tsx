
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [location, setLocation] = useState<string>("New York, NY");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAuthModal = () => setIsAuthModalOpen(!isAuthModalOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1 text-xl font-bold bg-brand-teal rounded-md text-white">SP</div>
            <span className="text-lg font-bold text-brand-navy">ShopSpot</span>
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="text-brand-teal" />
            <span>{location}</span>
          </div>
          <Button variant="outline" onClick={toggleAuthModal} className="gap-2">
            <User size={16} />
            <span>Sign In</span>
          </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="p-1">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col items-start p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-brand-teal" />
              <span>{location}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                toggleAuthModal();
                setIsMenuOpen(false);
              }} 
              className="w-full gap-2"
            >
              <User size={16} />
              <span>Sign In</span>
            </Button>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={toggleAuthModal} />
    </header>
  );
};

export default Navbar;
