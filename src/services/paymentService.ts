
import { supabase } from '@/integrations/supabase/client';

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

/**
 * Process a subscription payment for a vendor
 * In a real application, this would integrate with Stripe or another payment processor
 */
export const processSubscriptionPayment = async (
  vendorId: string, 
  planId: string, 
  amount: number
): Promise<PaymentResult> => {
  try {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock transaction ID
    const transactionId = 'txn_' + Math.random().toString(36).substring(2, 15);
    
    // Record the payment in the database
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        vendor_id: vendorId,
        plan_type: planId,
        amount,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      
    if (error) throw error;
    
    // Update the vendor's subscription status
    const { error: updateError } = await supabase
      .from('vendors')
      .update({
        subscription_status: planId,
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', vendorId);
      
    if (updateError) throw updateError;
    
    return {
      success: true,
      message: 'Payment processed successfully',
      transactionId
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while processing payment'
    };
  }
};

/**
 * Get subscription history for a vendor
 */
export const getSubscriptionHistory = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    return [];
  }
};
