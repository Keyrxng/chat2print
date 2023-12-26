export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mockup_requests: {
        Row: {
          created_at: string
          id: number
          image_data: string | null
          offset_x: number | null
          offset_y: number | null
          price: number | null
          product: string | null
          product_id: number | null
          scaled_height: number | null
          scaled_width: number | null
          status: Database["public"]["Enums"]["mockup_status"] | null
          task_key: string | null
          updated_at: string | null
          user_id: string | null
          variant_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_data?: string | null
          offset_x?: number | null
          offset_y?: number | null
          price?: number | null
          product?: string | null
          product_id?: number | null
          scaled_height?: number | null
          scaled_width?: number | null
          status?: Database["public"]["Enums"]["mockup_status"] | null
          task_key?: string | null
          updated_at?: string | null
          user_id?: string | null
          variant_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          image_data?: string | null
          offset_x?: number | null
          offset_y?: number | null
          price?: number | null
          product?: string | null
          product_id?: number | null
          scaled_height?: number | null
          scaled_width?: number | null
          status?: Database["public"]["Enums"]["mockup_status"] | null
          task_key?: string | null
          updated_at?: string | null
          user_id?: string | null
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mockup_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mockups: {
        Row: {
          created_at: string
          mockups: Json | null
          price: number | null
          printFiles: Json | null
          product: string | null
          product_id: number | null
          task_key: string
          user_id: string | null
          variant_id: number | null
        }
        Insert: {
          created_at?: string
          mockups?: Json | null
          price?: number | null
          printFiles?: Json | null
          product?: string | null
          product_id?: number | null
          task_key: string
          user_id?: string | null
          variant_id?: number | null
        }
        Update: {
          created_at?: string
          mockups?: Json | null
          price?: number | null
          printFiles?: Json | null
          product?: string | null
          product_id?: number | null
          task_key?: string
          user_id?: string | null
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mockups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          completed: boolean
          created_at: string
          final: Json
          items: Json | null
          product: string
          retail_costs: Json | null
          task_key: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          final?: Json
          items?: Json | null
          product?: string
          retail_costs?: Json | null
          task_key: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          final?: Json
          items?: Json | null
          product?: string
          retail_costs?: Json | null
          task_key?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      upscales: {
        Row: {
          bucket_path: string | null
          created_at: string | null
          finalized: Json | null
          id: number
          idd: string | null
          user_id: string | null
        }
        Insert: {
          bucket_path?: string | null
          created_at?: string | null
          finalized?: Json | null
          id?: number
          idd?: string | null
          user_id?: string | null
        }
        Update: {
          bucket_path?: string | null
          created_at?: string | null
          finalized?: Json | null
          id?: number
          idd?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upscales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_tiers: {
        Row: {
          crafter: Json | null
          designer: Json | null
          free: Json | null
          id: number
          manufacturer: Json | null
        }
        Insert: {
          crafter?: Json | null
          designer?: Json | null
          free?: Json | null
          id?: number
          manufacturer?: Json | null
        }
        Update: {
          crafter?: Json | null
          designer?: Json | null
          free?: Json | null
          id?: number
          manufacturer?: Json | null
        }
        Relationships: []
      }
      user_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["actions"]
          data_size: number | null
          id: number
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["actions"]
          data_size?: number | null
          id?: number
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["actions"]
          data_size?: number | null
          id?: number
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
          tier: Database["public"]["Enums"]["usage_tier"] | null
        }
        Insert: {
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
          tier?: Database["public"]["Enums"]["usage_tier"] | null
        }
        Update: {
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
          tier?: Database["public"]["Enums"]["usage_tier"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      list_objects: {
        Args: {
          bucketid: string
          prefix: string
          limits?: number
          offsets?: number
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      actions: "enhancement" | "mockup" | "import"
      mockup_status: "pending" | "processing" | "completed" | "failed"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
      usage_tier: "free" | "one-time" | "silver" | "gold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
