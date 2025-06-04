import { ChunkingConfig } from '@/features/tenants/interfaces/chunking-config.interface';

export interface EmbeddingsConfig {
  index_type: string;
  chunking_strategy: string;
  additional_metadata: null;
  chunking_config: ChunkingConfig;
}
