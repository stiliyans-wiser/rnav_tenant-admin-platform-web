export interface AutoReplacementConfig {
  enabled: boolean;
  min_pool_threshold: number;
  debounce_window_seconds: number;
  max_replacement_suggestions: number;
}

export const DEFAULT_AUTO_REPLACEMENT_CONFIG: AutoReplacementConfig = {
  enabled: false,
  min_pool_threshold: 5,
  debounce_window_seconds: 300,
  max_replacement_suggestions: 10,
};
