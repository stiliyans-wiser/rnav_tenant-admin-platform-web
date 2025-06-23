import { TenantLogo } from '@/features/tenants/interfaces/tenant-logo.interface';

export interface TenantSettings {
  preferred_currency: string;
  preferred_timezone: string;
  theme: string;
  theme_color: string;
  default_theme_mode: string;
  logos: {
    light?: TenantLogo;
    dark?: TenantLogo;
  };
  has_dark_logo?: boolean;
}
