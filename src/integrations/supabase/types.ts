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
      guidelines: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_mandatory: boolean
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_mandatory?: boolean
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_mandatory?: boolean
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      literature: {
        Row: {
          authors: string[]
          created_at: string
          doi: string | null
          id: string
          journal: string
          notes: boolean
          rating: number
          saved: boolean
          tags: string[]
          title: string
          year: number
        }
        Insert: {
          authors: string[]
          created_at?: string
          doi?: string | null
          id?: string
          journal: string
          notes?: boolean
          rating?: number
          saved?: boolean
          tags?: string[]
          title: string
          year: number
        }
        Update: {
          authors?: string[]
          created_at?: string
          doi?: string | null
          id?: string
          journal?: string
          notes?: boolean
          rating?: number
          saved?: boolean
          tags?: string[]
          title?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          author: string
          comments: number
          content: string | null
          created_at: string
          date: string
          id: string
          keywords: string[]
          title: string
          type: string
          views: number
        }
        Insert: {
          author: string
          comments?: number
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          keywords?: string[]
          title: string
          type: string
          views?: number
        }
        Update: {
          author?: string
          comments?: number
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          keywords?: string[]
          title?: string
          type?: string
          views?: number
        }
        Relationships: []
      }
      research_outputs: {
        Row: {
          authors: string[]
          citations: number | null
          created_at: string
          id: string
          link: string | null
          saved: boolean | null
          tags: string[]
          title: string
          type: string
          venue: string | null
          year: number
        }
        Insert: {
          authors: string[]
          citations?: number | null
          created_at?: string
          id?: string
          link?: string | null
          saved?: boolean | null
          tags?: string[]
          title: string
          type: string
          venue?: string | null
          year: number
        }
        Update: {
          authors?: string[]
          citations?: number | null
          created_at?: string
          id?: string
          link?: string | null
          saved?: boolean | null
          tags?: string[]
          title?: string
          type?: string
          venue?: string | null
          year?: number
        }
        Relationships: []
      }
      tools: {
        Row: {
          author: string
          created_at: string
          description: string
          has_documentation: boolean
          id: string
          last_updated: string | null
          name: string
          stars: number
          tags: string[]
          type: string
          views: number
        }
        Insert: {
          author: string
          created_at?: string
          description: string
          has_documentation?: boolean
          id?: string
          last_updated?: string | null
          name: string
          stars?: number
          tags?: string[]
          type: string
          views?: number
        }
        Update: {
          author?: string
          created_at?: string
          description?: string
          has_documentation?: boolean
          id?: string
          last_updated?: string | null
          name?: string
          stars?: number
          tags?: string[]
          type?: string
          views?: number
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
