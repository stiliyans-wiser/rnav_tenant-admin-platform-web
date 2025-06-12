/**
 * Utility to check if code is running in a client-side environment (browser)
 * Returns false during server-side rendering (SSR)
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
}; 