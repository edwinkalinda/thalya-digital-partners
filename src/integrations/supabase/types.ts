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
      business_profiles: {
        Row: {
          appointment_type: string
          booking_tools: string[] | null
          business_name: string
          business_type: string
          created_at: string
          id: string
          intro_prompt: string | null
          owner_email: string
          phone_number: string | null
          preferred_tone: string | null
          restrictions: string | null
          spoken_languages: string[] | null
          webhook_url: string | null
          working_hours: Json | null
        }
        Insert: {
          appointment_type: string
          booking_tools?: string[] | null
          business_name: string
          business_type: string
          created_at?: string
          id?: string
          intro_prompt?: string | null
          owner_email: string
          phone_number?: string | null
          preferred_tone?: string | null
          restrictions?: string | null
          spoken_languages?: string[] | null
          webhook_url?: string | null
          working_hours?: Json | null
        }
        Update: {
          appointment_type?: string
          booking_tools?: string[] | null
          business_name?: string
          business_type?: string
          created_at?: string
          id?: string
          intro_prompt?: string | null
          owner_email?: string
          phone_number?: string | null
          preferred_tone?: string | null
          restrictions?: string | null
          spoken_languages?: string[] | null
          webhook_url?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      caller_profiles: {
        Row: {
          business: string | null
          created_at: string
          email: string | null
          id: string
          last_contacted: string | null
          last_seen_at: string | null
          metadata: Json | null
          name: string | null
          notes: string | null
          phone_number: string
          preferred_language: string | null
          tags: string[] | null
          voice_signature: string | null
        }
        Insert: {
          business?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted?: string | null
          last_seen_at?: string | null
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone_number: string
          preferred_language?: string | null
          tags?: string[] | null
          voice_signature?: string | null
        }
        Update: {
          business?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted?: string | null
          last_seen_at?: string | null
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone_number?: string
          preferred_language?: string | null
          tags?: string[] | null
          voice_signature?: string | null
        }
        Relationships: []
      }
      clinic_appointments: {
        Row: {
          appointment_time: string
          created_at: string
          id: string
          patient_name: string
          phone_number: string
          practitioner_type: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          appointment_time: string
          created_at?: string
          id?: string
          patient_name: string
          phone_number: string
          practitioner_type?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          appointment_time?: string
          created_at?: string
          id?: string
          patient_name?: string
          phone_number?: string
          practitioner_type?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: []
      }
      onboarding_analytics: {
        Row: {
          business_type: string | null
          completed: boolean | null
          created_at: string
          duration: number | null
          id: string
          session_id: string
          step_count: number | null
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          completed?: boolean | null
          created_at?: string
          duration?: number | null
          id?: string
          session_id: string
          step_count?: number | null
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          completed?: boolean | null
          created_at?: string
          duration?: number | null
          id?: string
          session_id?: string
          step_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_completions: {
        Row: {
          business_name: string | null
          business_type: string | null
          completed_at: string | null
          created_at: string | null
          email: string
          id: string
          language: string | null
          needs: string | null
          profession: string | null
          session_id: string | null
          tone: string | null
          use_case: string | null
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          language?: string | null
          needs?: string | null
          profession?: string | null
          session_id?: string | null
          tone?: string | null
          use_case?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          language?: string | null
          needs?: string | null
          profession?: string | null
          session_id?: string | null
          tone?: string | null
          use_case?: string | null
        }
        Relationships: []
      }
      onboarding_logs: {
        Row: {
          business_profile_id: string | null
          created_at: string
          id: string
          question: string
          response: string
        }
        Insert: {
          business_profile_id?: string | null
          created_at?: string
          id?: string
          question: string
          response: string
        }
        Update: {
          business_profile_id?: string | null
          created_at?: string
          id?: string
          question?: string
          response?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_logs_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_campaigns: {
        Row: {
          channels: string[] | null
          created_at: string
          description: string | null
          id: string
          message_template: string | null
          schedule: Json | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          channels?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          message_template?: string | null
          schedule?: Json | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          channels?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          message_template?: string | null
          schedule?: Json | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      outreach_jobs: {
        Row: {
          attempts: number | null
          campaign_id: string | null
          channel: string | null
          created_at: string
          id: string
          last_error: string | null
          lead_id: string | null
          scheduled_at: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          attempts?: number | null
          campaign_id?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          lead_id?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          attempts?: number | null
          campaign_id?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          lead_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_jobs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_jobs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "outreach_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_leads: {
        Row: {
          campaign_id: string | null
          created_at: string
          email: string
          id: string
          last_contacted_at: string | null
          last_message: string | null
          metadata: Json | null
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          email: string
          id?: string
          last_contacted_at?: string | null
          last_message?: string | null
          metadata?: Json | null
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contacted_at?: string | null
          last_message?: string | null
          metadata?: Json | null
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      real_estate_leads: {
        Row: {
          budget_range: string | null
          client_name: string
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone_number: string
          preferred_area: string | null
          property_type: string | null
          status: string | null
        }
        Insert: {
          budget_range?: string | null
          client_name: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone_number: string
          preferred_area?: string | null
          property_type?: string | null
          status?: string | null
        }
        Update: {
          budget_range?: string | null
          client_name?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone_number?: string
          preferred_area?: string | null
          property_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      restaurant_reservations: {
        Row: {
          created_at: string
          customer_name: string
          id: string
          party_size: number | null
          phone_number: string
          reservation_time: string
          special_requests: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          customer_name: string
          id?: string
          party_size?: number | null
          phone_number: string
          reservation_time: string
          special_requests?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          customer_name?: string
          id?: string
          party_size?: number | null
          phone_number?: string
          reservation_time?: string
          special_requests?: string | null
          status?: string | null
        }
        Relationships: []
      }
      thalya_connect_configs: {
        Row: {
          business_name: string
          created_at: string | null
          id: string
          industry: string | null
          main_products_services: string | null
          target_audience: string | null
          tone_of_voice: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_name: string
          created_at?: string | null
          id?: string
          industry?: string | null
          main_products_services?: string | null
          target_audience?: string | null
          tone_of_voice?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string | null
          id?: string
          industry?: string | null
          main_products_services?: string | null
          target_audience?: string | null
          tone_of_voice?: string | null
          updated_at?: string | null
          user_id?: string | null
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
