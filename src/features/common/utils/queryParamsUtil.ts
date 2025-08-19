/**
 * Utility to build query string parameters from an object
 * Handles null/undefined values, dates, arrays, and empty strings
 */
export const buildQueryParams = <T extends Record<string, any>>(params: T): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') {
      return;
    }

    if (value instanceof Date) {
      searchParams.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        if (item != null && item !== '') {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
};

/**
 * Builds a complete URL with query parameters
 */
export const buildUrlWithParams = <T extends Record<string, any>>(baseUrl: string, params: T): string => {
  const queryParams = buildQueryParams(params);
  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
