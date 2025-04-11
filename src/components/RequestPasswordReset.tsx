
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface RequestPasswordResetProps {
  onBack: () => void;
}

const RequestPasswordReset = ({ onBack }: RequestPasswordResetProps) => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setSubmitted(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Check your email</h3>
        <p className="text-muted-foreground mb-4">
          We've sent you a password reset link. Please check your email and follow the instructions.
        </p>
        <Button variant="outline" onClick={onBack}>Back to Login</Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Reset your password</h3>
      <p className="text-muted-foreground mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    type="email" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="sm:flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="bg-brand-teal hover:bg-brand-teal/90 sm:flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RequestPasswordReset;
