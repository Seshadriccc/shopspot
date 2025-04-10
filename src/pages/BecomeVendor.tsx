
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Building, MapPin, Tag, UploadCloud, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

const vendorSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const categories = [
  "Clothing & Apparel",
  "Electronics",
  "Home & Furniture",
  "Beauty & Personal Care",
  "Food & Grocery",
  "Sports & Outdoors",
  "Books & Stationery",
  "Toys & Games",
  "Health & Wellness",
  "Other"
];

const BecomeVendor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      shopName: '',
      description: '',
      address: '',
      category: '',
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: VendorFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert vendor record
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          user_id: user.id,
          shop_name: values.shopName,
          description: values.description,
          address: values.address,
          category: values.category,
          logo_url: null, // Will update this after upload
        })
        .select()
        .single();

      if (vendorError) throw vendorError;

      let logoUrl = null;
      
      // Upload logo if provided
      if (logoFile && vendorData) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${vendorData.id}_logo.${fileExt}`;
        const filePath = `vendor_logos/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('vendor_assets')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('vendor_assets')
          .getPublicUrl(filePath);
          
        logoUrl = urlData.publicUrl;
        
        // Update vendor record with logo URL
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ logo_url: logoUrl })
          .eq('id', vendorData.id);
          
        if (updateError) throw updateError;
      }

      toast({
        title: "Vendor registration successful",
        description: "Your shop has been registered. You're now in free trial mode!",
      });

      // Create initial subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          vendor_id: vendorData.id,
          plan_type: 'free_trial',
          amount: 0,
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

      if (subscriptionError) throw subscriptionError;

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-3xl py-10 mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-brand-navy">Become a Vendor</h1>
          <p className="text-muted-foreground mt-2">
            Register your shop on ShopSpot and start selling your products.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 mb-6 border-2 border-dashed rounded-lg border-gray-300">
                {logoPreview ? (
                  <div className="relative w-32 h-32 mb-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="object-cover w-full h-full rounded-full"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-32 h-32 mb-4 bg-gray-100 rounded-full">
                    <Store className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <p className="mb-2 text-sm font-medium">Upload shop logo</p>
                <p className="mb-4 text-xs text-gray-500">PNG, JPG or WEBP (recommended size 300x300px)</p>
                <label className="cursor-pointer">
                  <Input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoChange}
                  />
                  <div className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-teal hover:bg-brand-teal/90">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload Logo
                  </div>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Awesome Shop" 
                          {...field} 
                          icon={<Building className="w-4 h-4 text-gray-500" />}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell customers about your shop and what you sell..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Main St, New York, NY 10001" 
                        {...field} 
                        icon={<MapPin className="w-4 h-4 text-gray-500" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-brand-teal hover:bg-brand-teal/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Your Shop"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BecomeVendor;
