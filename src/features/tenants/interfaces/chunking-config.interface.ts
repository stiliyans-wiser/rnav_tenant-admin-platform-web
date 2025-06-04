export interface ChunkingConfig {
  chunk_size: number;
  chunk_overlap: number;
  pdf_table_parser: string;
  chunk_enabled: boolean;
  concatenate_similar_tables: boolean;
  save_polygon_data: boolean;
}
