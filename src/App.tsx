
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BecomeVendor from "./pages/BecomeVendor";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import TokensPage from "./pages/TokensPage";
import Login from "./pages/Login";
import LeadQualifier from "./pages/LeadQualifier";
import ResetPassword from "./pages/ResetPassword";
import { Loader2 } from "lucide-react";

// Create a client
const queryClient = new QueryClient();

// Protected route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-brand-teal/5 to-brand-coral/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-brand-teal" />
          <p className="mt-4 text-lg text-brand-navy">Loading your account...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/become-vendor" element={
                <ProtectedRoute>
                  <BecomeVendor />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              } />
              <Route path="/tokens" element={
                <ProtectedRoute>
                  <TokensPage />
                </ProtectedRoute>
              } />
              <Route path="/lead-qualifier" element={
                <ProtectedRoute>
                  <LeadQualifier />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
