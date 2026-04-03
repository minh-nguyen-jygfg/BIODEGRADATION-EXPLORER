/**
 * Add cache busting parameter to avatar URL to force image refresh
 * Uses profile update timestamp for consistent cache busting
 */
export const getAvatarUrlWithCacheBusting = (
  avatarUrl: string | null | undefined, 
  updatedAt?: string
): string | undefined => {
  if (!avatarUrl) return undefined;
  
  // Don't add cache busting to ui-avatars.com URLs
  if (avatarUrl.includes('ui-avatars.com')) {
    return avatarUrl;
  }
  
  // Add timestamp to bypass cache
  const separator = avatarUrl.includes('?') ? '&' : '?';
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  return `${avatarUrl}${separator}t=${timestamp}`;
};

/**
 * Get fallback avatar URL with user's name
 */
export const getFallbackAvatarUrl = (name: string = 'User'): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=A78BFA&color=fff`;
};

/**
 * Get avatar URL or fallback
 */
export const getAvatarUrl = (
  avatarUrl: string | null | undefined, 
  fallbackName: string = 'User',
  updatedAt?: string
): string => {
  if (avatarUrl) {
    return getAvatarUrlWithCacheBusting(avatarUrl, updatedAt) || getFallbackAvatarUrl(fallbackName);
  }
  return getFallbackAvatarUrl(fallbackName);
};
