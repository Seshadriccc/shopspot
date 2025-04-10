
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create the vendor_assets bucket if it doesn't exist
    const { error } = await supabaseAdmin.storage.createBucket('vendor_assets', {
      public: true,
      fileSizeLimit: 10485760, // 10MB limit
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    });

    if (error && error.message !== 'Bucket already exists') {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: error?.message === 'Bucket already exists' 
          ? 'Bucket already exists' 
          : 'Bucket created successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
