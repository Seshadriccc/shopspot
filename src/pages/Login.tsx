
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import { useToast } from "@/hooks/use-toast";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user is already logged in, redirect to home
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const handleLogin = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 px-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 text-3xl font-bold bg-brand-teal rounded-md text-white">SP</div>
            </div>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestPasswordReset onBack={() => setShowForgotPassword(false)} />
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ShopSpot. All rights reserved.
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 text-3xl font-bold bg-brand-teal rounded-md text-white">SP</div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ShopSpot</CardTitle>
          <CardDescription>
            Sign in to discover local deals and manage your shop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="your@email.com" 
                              type="email" 
                              className="pl-10" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowForgotPassword(true);
                            }}
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              type="password" 
                              className="pl-10" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="your@email.com" 
                              type="email" 
                              className="pl-10" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              type="password" 
                              className="pl-10" 
                              {...field} 
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="text-center">
            <p>By continuing, you agree to ShopSpot's</p>
            <p className="mt-1">
              <a href="#" className="text-brand-teal hover:underline">Terms of Service</a>
              {" & "}
              <a href="#" className="text-brand-teal hover:underline">Privacy Policy</a>
            </p>
          </div>
          <div>&copy; {new Date().getFullYear()} ShopSpot. All rights reserved.</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
