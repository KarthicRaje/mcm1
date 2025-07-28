
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
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_log_action"]
          created_at: string
          details: string | null
          id: number
          notification_id: number | null
          notification_title: string | null
          timestamp: string
          user: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_log_action"]
          created_at?: string
          details?: string | null
          id?: number
          notification_id?: number | null
          notification_title?: string | null
          timestamp?: string
          user: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_log_action"]
          created_at?: string
          details?: string | null
          id?: number
          notification_id?: number | null
          notification_title?: string | null
          timestamp?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_comments: {
        Row: {
          created_at: string
          id: number
          notification_id: number
          text: string
          timestamp: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          notification_id: number
          text: string
          timestamp?: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          created_at?: string
          id?: number
          notification_id?: number
          text?: string
          timestamp?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_comments_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          acknowledged: boolean
          comments: Json[]
          created_at: string
          id: number
          message: string
          priority: Database["public"]["Enums"]["notification_priority"]
          resolved: boolean
          site: string | null
          snoozed_until: string | null
          timestamp: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          acknowledged?: boolean
          comments?: Json[]
          created_at?: string
          id?: number
          message: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          resolved?: boolean
          site?: string | null
          snoozed_until?: string | null
          timestamp: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          acknowledged?: boolean
          comments?: Json[]
          created_at?: string
          id?: number
          message?: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          resolved?: boolean
          site?: string | null
          snoozed_until?: string | null
          timestamp?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          subscription_object: Json
        }
        Insert: {
          created_at?: string
          id?: string
          subscription_object: Json
        }
        Update: {
          created_at?: string
          id?: string
          subscription_object?: Json
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          endpoint: string
          id: string
          name: string
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          endpoint: string
          id?: string
          name: string
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          endpoint?: string
          id?: string
          name?: string
          subscribed?: boolean
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
      audit_log_action:
        | "created"
        | "acknowledged"
        | "resolved"
        | "commented"
        | "snoozed"
      notification_priority: "low" | "medium" | "high"
      notification_type: "site_down" | "server_alert" | "custom"
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
    : never = never,
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
