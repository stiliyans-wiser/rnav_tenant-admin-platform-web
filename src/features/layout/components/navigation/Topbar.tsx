'use client';

import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useColorScheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { ProfileDropdown } from './ProfileDropdown';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import lightThemeLogo from '@/assets/logo-light-theme.png';
import darkThemeLogo from '@/assets/logo-dark-theme.png';
import { useGetTenantById } from '@/features/tenants/hooks/useGetTenantById';
import { useGetTenants } from '@/features/tenants/hooks/useGetTenants';
import { ChatStrategyEnum } from '@/features/tenants/enums/chat-strategy.enum';

export const Topbar = () => {
  const { mode } = useColorScheme();
  const params = useParams();
  const tenantId = (params as any)?.id as string | undefined;
  const { data: tenant } = useGetTenantById(tenantId || '');
  const { data: tenants } = useGetTenants();
  const effectiveTenant = tenant ?? tenants?.[0];

  const lightLogoSrc = effectiveTenant?.settings?.logos?.light
    ? `data:${effectiveTenant.settings.logos.light.file_type};base64,${effectiveTenant.settings.logos.light.content_base64}`
    : lightThemeLogo;

  const darkLogoSrc = effectiveTenant?.settings?.logos?.dark
    ? `data:${effectiveTenant.settings.logos.dark.file_type};base64,${effectiveTenant.settings.logos.dark.content_base64}`
    : effectiveTenant?.settings?.logos?.light
      ? `data:${effectiveTenant.settings.logos.light.file_type};base64,${effectiveTenant.settings.logos.light.content_base64}`
      : darkThemeLogo;

  const logo = mode === ThemeMode.LIGHT ? lightLogoSrc : darkLogoSrc;

  const defaultTitle = 'Productised AI Factory - Back Office';
  const titleByStrategy: Record<ChatStrategyEnum, string> = {
    [ChatStrategyEnum.DEFAULT]: defaultTitle,
    [ChatStrategyEnum.PATIENT_HEALTH_PROFILE]: 'Patient Health Profile - Back Office',
    [ChatStrategyEnum.TAQA]: 'TQ* Investment Advisor - Back Office',
  };
  const title = effectiveTenant?.chat_strategy ? (titleByStrategy[effectiveTenant.chat_strategy] ?? defaultTitle) : defaultTitle;

  return (
    <Paper
      variant="outlined"
      square
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}
      data-testid="topbar"
    >
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Link data-testid="topbarLogo" component="div">
          <Stack sx={{ paddingX: 3, alignItems: 'center' }}>
            <Image src={logo} alt="Logo" width={104} height={32} style={{ objectFit: 'contain' }} />
          </Stack>
        </Link>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Typography variant="body1" sx={{ paddingLeft: 2 }}>
          {title}
        </Typography>
      </Stack>

      <Box sx={{ marginRight: 2 }}>
        <ProfileDropdown />
      </Box>
    </Paper>
  );
};
