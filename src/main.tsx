import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import defaultTheme from './theming/default-theme.ts';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={defaultTheme} {...({ forceThemeRerender: true } as any)} modeStorageKey="mui-mode">
      <CssBaseline />

      <Stack sx={{ height: '100vh', backgroundColor: 'background.default' }}>
        <App />
      </Stack>
    </ThemeProvider>
  </StrictMode>,
);
