/**
 * Resolves a potentially relative or misconfigured image URL.
 * It handles:
 * 1. Absolute URLs (standard ones)
 * 2. Relative URLs starting with /uploads/
 * 3. Misconfigured local development URLs pointing to local IPs
 */
export const getImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  const apiBase = import.meta.env.VITE_API_URL || "";
  
  // If it's a relative path provided by the backend, e.g., /uploads/image.jpg
  if (url.startsWith("/uploads/")) {
    return `${apiBase}${url}`;
  }

  // If it's already an absolute URL but points to a local network (e.g. from local development admin panel)
  // we try to "repair" it by pointing it to the current VITE_API_URL if possible.
  if (url.startsWith("http")) {
    const isLocalIP = url.includes("192.168.") || url.includes("localhost") || url.includes("127.0.0.1") || url.includes(":5000");
    
    // Only repair if it actually looks like it belongs to our backend system
    if (isLocalIP && url.includes("/uploads/")) {
        const parts = url.split("/uploads/");
        if (parts.length > 1) {
            return `${apiBase}/uploads/${parts[1]}`;
        }
    }

    // Auto-fix GitHub non-raw URLs
    if (url.includes("github.com") && url.includes("/blob/")) {
        return url
            .replace("github.com", "raw.githubusercontent.com")
            .replace("/blob/", "/");
    }
    
    // For anything else (like external unsplash links), return as is
    return url;
  }

  // Default fallback for anything else
  return url;
};
