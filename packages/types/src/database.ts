// Hand-written from supabase/migrations/20260101000000_initial_schema.sql
// Regenerate with: supabase gen types typescript --local > packages/types/src/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UnitRoleEnum = 'captain' | 'specialist' | 'core';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      factions: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          lore: string | null;
          color_primary: string;
          color_accent: string;
          image_url: string | null;
          store_url: string | null;
          rulebook_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          lore?: string | null;
          color_primary: string;
          color_accent: string;
          image_url?: string | null;
          store_url?: string | null;
          rulebook_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['factions']['Insert']>;
      };
      unit_types: {
        Row: {
          id: string;
          faction_id: string;
          name: string;
          role: UnitRoleEnum;
          actions: number;
          movement: number;
          melee_attack: number;
          ranged_attack: number;
          defence: number;
          health: number;
          points: number;
          max_per_army: number | null;
          abilities: Json;
          image_url: string | null;
          base_size_mm: number;
          store_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          faction_id: string;
          name: string;
          role: UnitRoleEnum;
          actions: number;
          movement: number;
          melee_attack: number;
          ranged_attack: number;
          defence: number;
          health: number;
          points: number;
          max_per_army?: number | null;
          abilities?: Json;
          image_url?: string | null;
          base_size_mm?: number;
          store_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['unit_types']['Insert']>;
      };
      weapons: {
        Row: {
          id: string;
          faction_id: string | null;
          name: string;
          range_inches: string | null;
          num_attacks: number;
          damage: string;
          defence_mod: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          faction_id?: string | null;
          name: string;
          range_inches?: string | null;
          num_attacks: number;
          damage: string;
          defence_mod?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['weapons']['Insert']>;
      };
      unit_weapons: {
        Row: { unit_type_id: string; weapon_id: string };
        Insert: { unit_type_id: string; weapon_id: string };
        Update: { unit_type_id?: string; weapon_id?: string };
      };
      keywords: {
        Row: { id: string; name: string; description: string };
        Insert: { id?: string; name: string; description: string };
        Update: { id?: string; name?: string; description?: string };
      };
      weapon_keywords: {
        Row: { weapon_id: string; keyword_id: string; parameter: string | null };
        Insert: { weapon_id: string; keyword_id: string; parameter?: string | null };
        Update: { weapon_id?: string; keyword_id?: string; parameter?: string | null };
      };
      army_lists: {
        Row: {
          id: string;
          user_id: string;
          faction_id: string;
          name: string;
          notes: string | null;
          points_total: number;
          is_public: boolean;
          share_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          faction_id: string;
          name?: string;
          notes?: string | null;
          points_total?: number;
          is_public?: boolean;
          share_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['army_lists']['Insert']>;
      };
      army_entries: {
        Row: { id: string; army_list_id: string; unit_type_id: string; quantity: number };
        Insert: { id?: string; army_list_id: string; unit_type_id: string; quantity?: number };
        Update: { id?: string; army_list_id?: string; unit_type_id?: string; quantity?: number };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      unit_role: UnitRoleEnum;
    };
  };
}
