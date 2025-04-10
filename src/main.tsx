
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from '@/integrations/supabase/client';

// Check if we have a session on initial load
const initialSession = await supabase.auth.getSession();
const isAuthenticated = !!initialSession.data.session;

console.log("Initial auth state:", isAuthenticated ? "Authenticated" : "Not authenticated");

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(<App />);
