export interface CreateTenantStepProps {
  onNext: (hasError: boolean) => void;
  onBack: (hasError: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isNextButtonDisabled?: boolean;
}
