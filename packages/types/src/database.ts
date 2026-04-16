// Supabase generated database types
// Run: supabase gen types typescript --local > packages/types/src/database.ts

export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: {
      unit_role: 'captain' | 'specialist' | 'core';
    };
  };
};
