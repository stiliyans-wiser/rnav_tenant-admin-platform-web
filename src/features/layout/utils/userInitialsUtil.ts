export const getUserInitials = (fullName: string | undefined) =>
  fullName
    ?.split(' ')
    ?.map(n => n.charAt(0).toUpperCase())
    ?.join('') || 'N/A';
