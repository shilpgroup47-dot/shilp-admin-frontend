import axios from 'axios';

/**
 * Get base URL from environment or fallback for image loading
 * Dynamic detection based on environment and access method
 */
const getImageBaseUrl = (): string => {
  // Production environment
  if (import.meta.env.PROD) {
    return 'https://mail.shilpgroup.com';
  }
  
  // Development environment - Dynamic detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If accessing via network IP, use network IP for images
    if (hostname === '192.168.2.143' || hostname.includes('192.168')) {
      return `${protocol}//${hostname}:8081`;
    }
    
    // If accessing via localhost, use localhost for images
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:8081`;
    }
    
    // Fallback for other scenarios
    return `${protocol}//${hostname}:8081`;
  }
  
  // Server-side rendering fallback
  return 'http://localhost:8081';
};

/**
 * Constructs a full image URL from a relative path or filename with cache busting
 * @param imagePath - The image path (can be relative, absolute, or just filename)
 * @param cacheBust - Whether to add cache busting parameter (default: true)
 * @returns Full URL to the image or empty string if no path
 */
export const getImageUrl = (imagePath: string | undefined | null, cacheBust: boolean = true): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '';
  }

  const imageBaseUrl = getImageBaseUrl(); // Use separate image base URL
  let fullUrl = '';

  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    fullUrl = imagePath;
  }
  // If it starts with /uploads, it's a proper server path
  else if (imagePath.startsWith('/uploads/')) {
    fullUrl = `${imageBaseUrl}${imagePath}`;
  }
  // If it starts with uploads/ (without leading slash), add the slash
  else if (imagePath.startsWith('uploads/')) {
    fullUrl = `${imageBaseUrl}/${imagePath}`;
  }
  // If it's just a filename, assume it's in the banners folder
  else if (!imagePath.includes('/')) {
    fullUrl = `${imageBaseUrl}/uploads/banners/${imagePath}`;
  }
  // Otherwise, treat it as a relative path from the server root
  else {
    fullUrl = `${imageBaseUrl}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
  }

  // Add cache busting parameter for fresh images
  if (cacheBust && fullUrl) {
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl += `${separator}t=${Date.now()}`;
  }

  // Debug logging removed

  return fullUrl;
};

/**
 * Checks if an image URL is valid and accessible
 * @param imageUrl - The image URL to check
 * @returns Promise that resolves to true if image is accessible
 */
export const isImageAccessible = async (imageUrl: string): Promise<boolean> => {
  if (!imageUrl) return false;
  
  try {
    const response = await axios.head(imageUrl);
    return response.status >= 200 && response.status < 300;
  } catch {
    return false;
  }
};

/**
 * Formats file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Formats upload date in a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatUploadDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid date';
  }
};