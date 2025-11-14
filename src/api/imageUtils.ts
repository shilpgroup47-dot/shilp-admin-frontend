import axios from 'axios';
import { getImageUrl as getImageUrlFromConfig } from './config';

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

  // Use the centralized image URL function from config
  let fullUrl = getImageUrlFromConfig(imagePath);

  // Add cache busting parameter for fresh images
  if (cacheBust && fullUrl) {
    const separator = fullUrl.includes('?') ? '&' : '?';
    fullUrl += `${separator}t=${Date.now()}`;
  }

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