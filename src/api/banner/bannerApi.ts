import axios from 'axios';
import { API_CONFIG } from '../config';

// Banner API types
export interface BannerMetadata {
  uploadedAt: string | null;
  filename: string;
  originalName: string;
  size: number;
}

export interface BannerSection {
  banner: string;
  mobilebanner: string;
  alt: string;
  bannerMetadata?: BannerMetadata;
  mobilebannerMetadata?: BannerMetadata;
}

export interface BannersData {
  _id: string;
  documentId: string;
  homepageBanner: BannerSection;
  aboutUs: BannerSection;
  commercialBanner: BannerSection;
  plotBanner: BannerSection;
  residentialBanner: BannerSection;
  contactBanners: BannerSection;
  careerBanner: BannerSection;
  ourTeamBanner: BannerSection;
  termsConditionsBanner: BannerSection;
  privacyPolicyBanner: BannerSection;
}

export interface BannerApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Create axios instance for banner API
const bannerApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add auth interceptor
bannerApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Banner API functions - Simple function approach (no classes)

// Get all banners
export const getBanners = async (): Promise<BannerApiResponse<BannersData>> => {
  try {
    const response = await bannerApiClient.get('/api/banners');
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Banner API request failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    throw new Error(errorMessage || 'Failed to fetch banners');
  }
};

// Upload banner image
export const uploadBannerImage = async (
  section: string,
  field: 'banner' | 'mobilebanner' | 'image' | 'mobileimage',
  file: File,
  alt?: string
): Promise<BannerApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    if (alt) {
      formData.append('alt', alt);
    }

    const response = await bannerApiClient.post(
      `/api/banners/${section}/${field}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    throw new Error(errorMessage || 'Failed to upload banner image');
  }
};

// Update banner alt text
export const updateBannerAlt = async (
  section: string,
  alt: string
): Promise<BannerApiResponse> => {
  try {
    const response = await bannerApiClient.put(`/api/banners/${section}/alt`, {
      alt,
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    throw new Error(errorMessage || 'Failed to update alt text');
  }
};

// Update blogsDetail title and description
export const updateBlogsDetailText = async (
  title: string,
  description: string
): Promise<BannerApiResponse> => {
  try {
    const response = await bannerApiClient.put('/api/banners/blogsDetail/text', {
      title,
      description,
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    throw new Error(errorMessage || 'Failed to update blogs text');
  }
};

// Delete banner image
export const deleteBannerImage = async (
  section: string,
  field: 'banner' | 'mobilebanner' | 'image' | 'mobileimage'
): Promise<BannerApiResponse> => {
  try {
    const response = await bannerApiClient.delete(`/api/banners/${section}/${field}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    throw new Error(errorMessage || 'Failed to delete banner image');
  }
};

// No default export needed - using individual function exports