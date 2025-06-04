export interface SearchConfig {
  k: number;
  rerank_k: number;
  metadata_filter_enabled: boolean;
  extend_with_neighbors: boolean;
  neighbors_k: number;
  rag_type: string;
  use_fact_checking: boolean;
}
