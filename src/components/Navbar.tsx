
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, User, Menu, X, LogOut, Store, ShoppingBag, Ticket, UserPlus, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [location, setLocation] = useState<string>("New York, NY");
  const { user, signOut, isVendor } = useAuth();
  const navigate = useNavigate();

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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User size={16} />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/tokens" className="flex items-center w-full cursor-pointer">
                    <Ticket className="w-4 h-4 mr-2" />
                    My Tokens
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center w-full cursor-pointer">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                
                {isVendor ? (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center w-full cursor-pointer">
                      <Store className="w-4 h-4 mr-2" />
                      Vendor Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/become-vendor" className="flex items-center w-full cursor-pointer">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Become a Vendor
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/login')} className="gap-2">
                <User size={16} />
                <span>Sign In</span>
              </Button>
              <Button onClick={() => navigate('/login')} className="gap-2 bg-brand-teal hover:bg-brand-teal/90">
                <UserPlus size={16} />
                <span>Register</span>
              </Button>
            </div>
          )}
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
            
            {user ? (
              <>
                <Link 
                  to="/tokens" 
                  className="flex items-center w-full gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Ticket size={16} />
                  <span>My Tokens</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="flex items-center w-full gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag size={16} />
                  <span>My Orders</span>
                </Link>
                {isVendor ? (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center w-full gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Store size={16} />
                    <span>Vendor Dashboard</span>
                  </Link>
                ) : (
                  <Link 
                    to="/become-vendor" 
                    className="flex items-center w-full gap-2 p-2 text-sm rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus size={16} />
                    <span>Become a Vendor</span>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }} 
                  className="w-full gap-2 text-red-600"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }} 
                  className="w-full gap-2"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }} 
                  className="w-full gap-2 bg-brand-teal hover:bg-brand-teal/90"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={toggleAuthModal} />
    </header>
  );
};

export default Navbar;
