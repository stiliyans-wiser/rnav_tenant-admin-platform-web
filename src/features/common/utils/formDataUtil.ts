/**
 * Creates FormData from an object with key-value pairs
 * @param data - Object to convert to FormData
 * @returns FormData instance
 */
export const createFormData = (data: Record<string, string | number | boolean | File>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};
