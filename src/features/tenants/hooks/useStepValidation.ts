import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const useStepValidation = (fieldNames: string[]) => {
  const { formState, getFieldState, trigger } = useFormContext();
  const validationKey = fieldNames.join('|');
  const stableFieldNames = useMemo(() => fieldNames, [validationKey]);

  // Check for errors
  const hasError = stableFieldNames.some(field => getFieldState(field, formState).invalid);

  // Trigger validation on component mount
  useEffect(() => {
    if (stableFieldNames.length > 0) {
      trigger(stableFieldNames);
    }
  }, [trigger, stableFieldNames]);

  return { hasError };
};
