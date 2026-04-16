// API request / response types

export interface ResolveShareResponse {
  list: import('./models').ArmyList & {
    faction: import('./models').Faction;
    entries: Array<import('./models').ArmyEntry>;
  };
}

export interface ExportPdfRequest {
  army_list_id: string;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}
