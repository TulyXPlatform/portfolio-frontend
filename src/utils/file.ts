/**
 * Resolves a potentially relative or misconfigured file/image URL.
 * Handles relative paths, local-network absolute URLs, and GitHub blobs.
 */
export const getFileUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  const apiBase = import.meta.env.VITE_API_URL || "";
  
  // If it's a relative path provided by the backend, e.g., /uploads/image.jpg
  if (url.startsWith("/uploads/")) {
    return `${apiBase}${url}`;
  }

  // If it's already an absolute URL but points to a local network
  if (url.startsWith("http")) {
    const isLocalIP = url.includes("192.168.") || url.includes("localhost") || url.includes("127.0.0.1") || url.includes(":5000");
    
    // Repair local backend URLs
    if (isLocalIP && url.includes("/uploads/")) {
        const parts = url.split("/uploads/");
        if (parts.length > 1) {
            // If the apiBase is still a local IP, use a relative path as a fallback
            // but the REAL fix is to update VITE_API_URL in production.
            return `${apiBase}/uploads/${parts[1]}`;
        }
    }

    // Auto-fix Imgur non-direct links
    if (url.includes("imgur.com") && !url.includes("i.imgur.com")) {
        const idMatch = url.match(/imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]+)/);
        if (idMatch && idMatch[1]) {
            return `https://i.imgur.com/${idMatch[1]}.png`;
        }
    }

    // Auto-fix GitHub non-raw URLs
    if (url.includes("github.com") && url.includes("/blob/")) {
        return url
            .replace("github.com", "raw.githubusercontent.com")
            .replace("/blob/", "/");
    }

    // Enforce HTTPS for known platforms or if the app is on HTTPS
    if (url.startsWith("http://") && !isLocalIP) {
        return url.replace("http://", "https://");
    }
    
    return url;
  }

  return url;
};

// Maintain alias for images specifically
export const getImageUrl = getFileUrl;
