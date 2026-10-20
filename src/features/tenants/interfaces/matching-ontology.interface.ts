export type EmbeddingStoreVersion = 'v1' | 'v2';

export type EscoMode = 'off' | 'shadow' | 'on';

export type ValueSource = 'stored' | 'default';

export type OntologyFieldName =
  | 'strict_enabled'
  | 'max_hops'
  | 'blocked_hubs'
  | 'static_aliases_enabled'
  | 'language_guard_enabled'
  | 'esco_resolution_enabled'
  | 'esco_mode'
  | 'store_version'
  | 'dual_write';

export interface TableCoverage {
  v1_rows: number;
  v2_rows: number;
  ratio: number;
}

export interface VectorCoverage {
  tables_exist: { candidates: boolean; jobs: boolean };
  candidates?: TableCoverage | null;
  jobs?: TableCoverage | null;
}

export interface MatchingOntologyDiagnostics {
  skill_relationship_count: number | null;
  vector_coverage: VectorCoverage | null;
  error: string | null;
}

export interface MatchingOntology {
  account_id: string;
  strict_enabled: boolean;
  max_hops: number;
  blocked_hubs: string[];
  static_aliases_enabled: boolean;
  language_guard_enabled: boolean;
  esco_resolution_enabled: boolean;
  esco_mode: EscoMode;
  esco_global_enabled: boolean;
  store_version: EmbeddingStoreVersion;
  dual_write: boolean;
  sources: Record<OntologyFieldName, ValueSource>;
  diagnostics: MatchingOntologyDiagnostics | null;
  changed_fields?: string[];
  audit_recorded?: boolean;
}

export interface MatchingOntologyPatch {
  strict_enabled?: boolean;
  max_hops?: number;
  blocked_hubs?: string[];
  reset_blocked_hubs?: boolean;
  static_aliases_enabled?: boolean;
  language_guard_enabled?: boolean;
  esco_mode?: EscoMode;
  store_version?: EmbeddingStoreVersion;
  dual_write?: boolean;
  force?: boolean;
}

export interface MatchingOntologyForm {
  strictEnabled: boolean;
  maxHops: string;
  useDefaultHubs: boolean;
  blockedHubsText: string;
  staticAliasesEnabled: boolean;
  languageGuardEnabled: boolean;
  escoMode: EscoMode;
  storeVersion: EmbeddingStoreVersion;
  dualWrite: boolean;
}

export interface FieldChange {
  label: string;
  from: string;
  to: string;
}
