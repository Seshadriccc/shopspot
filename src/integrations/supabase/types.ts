export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string | null
          id: string
          is_favorite: boolean | null
          occasion: string
          recommendations: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          occasion: string
          recommendations?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          occasion?: string
          recommendations?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_percent: number | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          body_type: string | null
          created_at: string | null
          height: number | null
          id: string
          profile_image: string | null
          style_preference: string | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          body_type?: string | null
          created_at?: string | null
          height?: number | null
          id: string
          profile_image?: string | null
          style_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          body_type?: string | null
          created_at?: string | null
          height?: number | null
          id?: string
          profile_image?: string | null
          style_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string | null
          expires_at: string
          id: string
          plan_type: string
          status: string
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expires_at: string
          id?: string
          plan_type: string
          status: string
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expires_at?: string
          id?: string
          plan_type?: string
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          body_type: string | null
          color_preferences: string[] | null
          created_at: string | null
          height: number | null
          id: string
          style_preferences: Json | null
          updated_at: string | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          body_type?: string | null
          color_preferences?: string[] | null
          created_at?: string | null
          height?: number | null
          id?: string
          style_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          body_type?: string | null
          color_preferences?: string[] | null
          created_at?: string | null
          height?: number | null
          id?: string
          style_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          shop_name: string
          subscription_expires_at: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          shop_name: string
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          shop_name?: string
          subscription_expires_at?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wardrobe_items: {
        Row: {
          category: string
          color: string
          created_at: string | null
          id: string
          image_url: string
          occasion: string
          season: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          color: string
          created_at?: string | null
          id?: string
          image_url: string
          occasion: string
          season: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          color?: string
          created_at?: string | null
          id?: string
          image_url?: string
          occasion?: string
          season?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
