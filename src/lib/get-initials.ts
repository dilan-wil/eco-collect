export const getInitials = (fullName?: string | null): string => {
  if (!fullName) return "";
  
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  
  if (parts.length === 0) return "";
  
  if (parts.length === 1) {
    // Single name: take first 2 letters
    const name = parts[0];
    return name.slice(0, 2).toUpperCase();
  }
  
  if (parts.length === 2) {
    // Two names: take first letter of each
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  // Three or more names: take first letter of first and last
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};