export interface SSOConfig {
  type: string;
  enabled: boolean;
  tenant_id: string;
  client_id: string;
  client_secret: string;
  scopes: string;
}
