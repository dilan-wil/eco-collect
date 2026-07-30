export const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";

  return (first + last).toUpperCase();
};
