import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';

interface StepLayoutProps {
  onNext: () => void;
  onBack: () => void;
  stepTitle: string;
  stepIcon: React.ReactNode;
  children: React.ReactNode;
  isNextButtonDisabled?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export const CreateTenantStepLayout = ({
  stepTitle,
  stepIcon,
  children,
  onNext,
  onBack,
  isNextButtonDisabled = false,
  isFirstStep = false,
  isLastStep = false,
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
            <Button disabled={isFirstStep} onClick={onBack}>
              Back
            </Button>

            <Button variant="contained" disabled={isNextButtonDisabled} onClick={onNext}>
              {isLastStep ? 'Finish' : 'Continue'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};
