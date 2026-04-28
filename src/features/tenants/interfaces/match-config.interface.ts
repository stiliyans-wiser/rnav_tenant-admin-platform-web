export interface MatchConfig {
  top_k: number;
  score_threshold?: number;
  use_hybrid_shortlist?: boolean;
  calibration_mode?: boolean;
  calibration_top_k_multiplier?: number;
}
