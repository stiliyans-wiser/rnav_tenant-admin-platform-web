import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';

interface StepLayoutProps {
  onNext: () => void;
  onBack: () => void;
  stepTitle: string;
  stepIcon: React.ReactNode;
  children: React.ReactNode;
  isBackButtonDisabled?: boolean;
  isNextButtonDisabled?: boolean;
  nextButtonLabel?: string;
}

export const CreateTenantStepLayout = ({
  stepTitle,
  stepIcon,
  children,
  onNext,
  onBack,
  isBackButtonDisabled = false,
  isNextButtonDisabled = false,
  nextButtonLabel = 'Continue',
}: StepLayoutProps) => {
  return (
    <Paper variant="outlined" sx={{ height: '100%' }}>
      <Stack gap={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center', p: 3 }}>
          {stepIcon}
          <Typography variant="h6">{stepTitle}</Typography>
        </Stack>

        <Stack sx={{ overflowY: 'auto', flex: 1 }}>
          <Stack sx={{ paddingX: 3 }}>{children}</Stack>
        </Stack>

        <Box sx={{ p: 3 }}>
          <Divider />
          <Stack direction="row" sx={{ justifyContent: 'space-between', marginTop: 3 }}>
            <Button disabled={isBackButtonDisabled} onClick={onBack}>
              Back
            </Button>

            <Button variant="contained" disabled={isNextButtonDisabled} onClick={onNext}>
              {nextButtonLabel}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
