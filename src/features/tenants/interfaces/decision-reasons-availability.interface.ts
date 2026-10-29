export interface DecisionReasonsAvailability {
  available: boolean;
  enabled: boolean;
  active: boolean;
  reason_count: number;
  schema_healthy: boolean;
  schema_missing_columns: string[];
  schema_probe_failed?: boolean;
}

export interface DecisionReasonsAvailabilityPatch {
  available?: boolean;
  reset_reasons?: boolean;
}
