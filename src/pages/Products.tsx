
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowLeft, Loader2, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OfferBadge from "@/components/OfferBadge";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_percent: number;
  image_url: string | null;
  category: string;
}

interface VendorData {
  id: string;
  subscription_status: string;
}

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.preprocess(
    (a) => (a === '' ? undefined : Number(a)),
    z.number().positive("Price must be positive")
  ),
  discount_percent: z.preprocess(
    (a) => (a === '' ? undefined : Number(a)),
    z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%")
  ),
  category: z.string().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = [
  "Clothing",
  "Electronics",
  "Home Goods",
  "Toys & Games",
  "Beauty",
  "Food",
  "Health",
  "Sports",
  "Books",
  "Other"
];

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      discount_percent: 0,
      category: '',
    },
  });

  useEffect(() => {
    const fetchVendorAndProducts = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        // Get vendor data first
        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('id, subscription_status')
          .eq('user_id', user.id)
          .single();

        if (vendorError) {
          if (vendorError.code === 'PGRST116') {
            // No vendor profile found
            setVendorData(null);
            setLoading(false);
            return;
          }
          throw vendorError;
        }
        
        setVendorData(vendorData);

        // Then fetch products for this vendor
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });
          
        if (productsError) throw productsError;
        
        setProducts(productsData || []);
      } catch (error: any) {
        console.error('Error fetching vendor data:', error);
        toast({
          title: "Error",
          description: "Could not fetch your products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorAndProducts();
  }, [user, navigate, toast]);

  const openAddProductDialog = () => {
    form.reset({
      name: '',
      description: '',
      price: 0,
      discount_percent: 0,
      category: '',
    });
    setSelectedProduct(null);
    setProductImage(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product: ProductData) => {
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_percent: product.discount_percent,
      category: product.category,
    });
    setSelectedProduct(product);
    setImagePreview(product.image_url);
    setProductImage(null);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: ProductData) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (values: ProductFormValues) => {
    if (!user || !vendorData) return;
    
    // Check product limit for free trial
    if (
      vendorData.subscription_status === 'free_trial' && 
      !selectedProduct && 
      products.length >= 10
    ) {
      toast({
        title: "Product Limit Reached",
        description: "You can only add up to 10 products on the free trial. Upgrade to Premium for unlimited products.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = selectedProduct?.image_url || null;
      
      // Upload image if provided
      if (productImage) {
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `product_images/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('vendor_assets')
          .upload(filePath, productImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('vendor_assets')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: values.name,
            description: values.description,
            price: values.price,
            discount_percent: values.discount_percent,
            category: values.category,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq('id', selectedProduct.id);
          
        if (error) throw error;
        
        toast({
          title: "Product Updated",
          description: "Your product has been updated successfully",
        });
        
        // Update local state
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? 
          { ...p, ...values, ...(imageUrl && { image_url: imageUrl }) } : 
          p
        ));
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert({
            vendor_id: vendorData.id,
            name: values.name,
            description: values.description,
            price: values.price,
            discount_percent: values.discount_percent,
            category: values.category,
            image_url: imageUrl,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: "Product Added",
          description: "Your product has been added successfully",
        });
        
        // Update local state
        setProducts([data, ...products]);
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving the product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
        
      if (error) throw error;
      
      toast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully",
      });
      
      // Update local state
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-10 mx-auto text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-brand-teal" />
          <h1 className="mb-4 text-2xl font-bold">You're not a vendor yet</h1>
          <p className="mb-6 text-muted-foreground">
            Register your shop to start managing products.
          </p>
          <Button onClick={() => navigate('/become-vendor')}>
            Become a Vendor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-10 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Products</h1>
            <p className="text-muted-foreground">
              {products.length} product{products.length !== 1 ? 's' : ''} in your shop
            </p>
          </div>
          
          <div className="flex flex-col gap-3 mt-4 sm:flex-row md:mt-0">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={openAddProductDialog}
              className="bg-brand-teal hover:bg-brand-teal/90"
              disabled={vendorData.subscription_status === 'free_trial' && products.length >= 10}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {vendorData.subscription_status === 'free_trial' && products.length >= 10 && (
          <div className="p-4 mb-6 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 text-amber-500" />
              <div>
                <h3 className="font-medium text-amber-800">Product Limit Reached</h3>
                <p className="text-sm text-amber-700">
                  You've reached the 10 product limit on the free trial. 
                  <Button 
                    variant="link" 
                    className="px-1 py-0 text-brand-teal"
                    onClick={() => navigate('/subscription')}
                  >
                    Upgrade to Premium
                  </Button>
                  for unlimited products.
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-6 border rounded-lg bg-gray-50">
            <Package className="w-12 h-12 mb-4 text-gray-400" />
            {products.length === 0 ? (
              <>
                <h3 className="mb-2 text-lg font-medium">No Products Yet</h3>
                <p className="mb-4 text-center text-muted-foreground">
                  You haven't added any products to your shop yet.
                </p>
                <Button 
                  onClick={openAddProductDialog}
                  className="bg-brand-teal hover:bg-brand-teal/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-lg font-medium">No Matching Products</h3>
                <p className="text-center text-muted-foreground">
                  No products match your search criteria. Try different keywords.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative overflow-hidden border rounded-lg group">
                {product.discount_percent > 0 && (
                  <OfferBadge discount={product.discount_percent} />
                )}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex-col items-center justify-center hidden gap-2 transition-opacity bg-black/60 group-hover:flex">
                    <Button 
                      size="sm" 
                      onClick={() => openEditProductDialog(product)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => openDeleteDialog(product)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center mt-2">
                    {product.discount_percent > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold">${((product.price * (100 - product.discount_percent)) / 100).toFixed(2)}</span>
                        <span className="text-sm line-through text-muted-foreground">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {selectedProduct ? 'update your' : 'add a new'} product.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveProduct)} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-32 h-32 overflow-hidden border rounded-lg bg-gray-50">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 p-1 rounded-full bg-white shadow-sm border cursor-pointer hover:bg-gray-100">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Edit className="w-4 h-4" />
                  </label>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount_percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                          <SelectValue placeholder="Select a category" />
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
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-brand-teal hover:bg-brand-teal/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
