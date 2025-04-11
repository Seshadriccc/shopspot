
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Store, Package, ShoppingCart, Ticket, FileText, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile"; // Fixed import name

const Navbar = () => {
  const { user, signOut, isVendor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile(); // Using the correctly named hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { label: "Discover", path: "/" },
    { label: "Tokens", path: "/tokens" },
    { label: "Lead Qualifier", path: "/lead-qualifier" },
  ];

  // Vendor navigation items
  const vendorItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText size={16} /> },
    { label: "Products", path: "/products", icon: <Package size={16} /> },
    { label: "Orders", path: "/orders", icon: <ShoppingCart size={16} /> },
    { label: "Subscription", path: "/subscription", icon: <Ticket size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1 text-xl font-bold bg-brand-teal rounded-md text-white">SP</div>
          <span className="font-bold hidden sm:inline-block">ShopSpot</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link to={item.path}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive(item.path) && "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}

              {isVendor && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Vendor</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[220px] gap-1 p-2">
                      {vendorItems.map((item) => (
                        <Link key={item.path} to={item.path}>
                          <NavigationMenuLink
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
                              isActive(item.path) && "bg-accent text-accent-foreground"
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </NavigationMenuLink>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}

              {!isVendor && user && (
                <NavigationMenuItem>
                  <Link to="/become-vendor">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Become a Vendor
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* User Menu (Desktop) */}
        {user && !isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-teal text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isVendor ? "Vendor Account" : "Customer Account"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/tokens")}>
                <Ticket className="mr-2 h-4 w-4" />
                <span>My Tokens</span>
              </DropdownMenuItem>
              {isVendor && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/products")}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Products</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/subscription")}>
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </DropdownMenuItem>
                </>
              )}
              {!isVendor && (
                <DropdownMenuItem onClick={() => navigate("/become-vendor")}>
                  <Store className="mr-2 h-4 w-4" />
                  <span>Become a Vendor</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>ShopSpot</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {user && (
                  <div className="flex items-center mb-6 pb-4 border-b">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-brand-teal text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isVendor ? "Vendor Account" : "Customer Account"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Main navigation */}
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isActive(item.path) && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}

                  {/* Vendor section */}
                  {isVendor && (
                    <>
                      <div className="pt-2 pb-1">
                        <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                      </div>
                      {vendorItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            isActive(item.path) && "bg-accent text-accent-foreground"
                          )}
                          onClick={() => {
                            navigate(item.path);
                            setIsMenuOpen(false);
                          }}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      ))}
                    </>
                  )}

                  {/* Become vendor button */}
                  {!isVendor && user && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/become-vendor");
                        setIsMenuOpen(false);
                      }}
                    >
                      <Store className="mr-2 h-4 w-4" />
                      Become a Vendor
                    </Button>
                  )}

                  {/* Sign out button */}
                  {user && (
                    <Button
                      variant="destructive"
                      className="w-full justify-start mt-4"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  )}

                  {/* Sign in button */}
                  {!user && (
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Mobile Sign In Button (when not logged in) */}
        {!user && isMobile && (
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
