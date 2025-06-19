import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export const useStepValidation = (fieldNames: string[]) => {
  const { formState, getFieldState, trigger } = useFormContext();

  // Check for errors
  const hasError = fieldNames.some(field => getFieldState(field, formState).invalid);

  // Trigger validation on component mount
  useEffect(() => {
    trigger();
  }, [trigger]);

  return { hasError };
};
