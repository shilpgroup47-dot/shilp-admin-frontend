import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Upload, Trash2, Loader2, Save, Eye, X, AlertCircle } from 'lucide-react';
import { getBanners, uploadBannerImage, updateBannerAlt, updateBlogsDetailText, deleteBannerImage, getImageUrl, formatFileSize, formatUploadDate } from '../../api';
import { SuccessModal, type SuccessModalProps } from '../../components/modals';



// Lazy Image Component for better performance
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = React.memo(({ 
  src, 
  alt, 
  className, 
  onLoad, 
  onError, 
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef || !src || src.trim() === '') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(imageRef);

    return () => observer.disconnect();
  }, [imageRef, src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.src = fallbackSrc;
    onError?.(e);
  };

  // Don't render image if src is empty or invalid
  if (!src || src.trim() === '') {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 min-h-[100px]`}>
        <span className="text-gray-500 text-sm">No Image</span>
      </div>
    );
  }

  return (
    <img
      ref={setImageRef}
      src={isLoaded ? src : fallbackSrc}
      alt={alt}
      className={className}
      onLoad={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
      onError={handleError}
      loading="lazy"
    />
  );
});

// Banner section type matching the database structure
interface BannerSectionData {
  banner: string;
  mobilebanner: string;
  alt: string;
  bannerMetadata?: {
    uploadedAt?: string | null;
    filename?: string;
    originalName?: string;
    size?: number;
  };
  mobilebannerMetadata?: {
    uploadedAt?: string | null;
    filename?: string;
    originalName?: string;
    size?: number;
  };
}

// Blogs Detail type for blogs image section
interface BlogsDetailData {
  image: string;
  mobileimage: string;
  alt: string;
  title: string;
  description: string;
  imageMetadata?: {
    uploadedAt?: string | null;
    filename?: string;
    originalName?: string;
    size?: number;
  };
  mobileimageMetadata?: {
    uploadedAt?: string | null;
    filename?: string;
    originalName?: string;
    size?: number;
  };
}

interface BannersData {
  homepageBanner: BannerSectionData;
  aboutUs: BannerSectionData;
  commercialBanner: BannerSectionData;
  plotBanner: BannerSectionData;
  residentialBanner: BannerSectionData;
  contactBanners: BannerSectionData;
  careerBanner: BannerSectionData;
  ourTeamBanner: BannerSectionData;
  termsConditionsBanner: BannerSectionData;
  privacyPolicyBanner: BannerSectionData;
  projectTreeBanner: BannerSectionData;
  blogsDetail: BlogsDetailData;
}

// Available banner sections
const BANNER_SECTIONS = [
  { key: 'homepageBanner', label: 'Homepage Banner' },
  { key: 'aboutUs', label: 'About Us Banner' },
  { key: 'commercialBanner', label: 'Commercial Banner' },
  { key: 'plotBanner', label: 'Plot Banner' },
  { key: 'residentialBanner', label: 'Residential Banner' },
  { key: 'contactBanners', label: 'Contact Banner' },
  { key: 'careerBanner', label: 'Career Banner' },
  { key: 'ourTeamBanner', label: 'Our Team Banner' },
  { key: 'termsConditionsBanner', label: 'Terms & Conditions Banner' },
  { key: 'privacyPolicyBanner', label: 'Privacy Policy Banner' },
  { key: 'projectTreeBanner', label: 'Project Tree Banner' },
  { key: 'blogsDetail', label: 'Blogs Image', isBlogsDetail: true },
];

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Partial<BannersData>>({});
  const [localAltTexts, setLocalAltTexts] = useState<Record<string, string>>({});
  const [localBlogsTitle, setLocalBlogsTitle] = useState<string>('');
  const [localBlogsDescription, setLocalBlogsDescription] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const lastUploadedSectionRef = useRef<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{ show: boolean; image: string; alt: string }>({ 
    show: false, 
    image: '', 
    alt: '' 
  });

  // Note: Debouncing available via useDebounce hook if needed for future enhancements
  
  // Success Modal State
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: SuccessModalProps['details'];
  }>({
    isOpen: false,
    title: '',
    message: '',
    details: undefined
  });

  // Memoized computed values for performance optimization
  const memoizedImageUrls = useMemo(() => {
    const urls: Record<string, { desktop: string; mobile: string }> = {};
    BANNER_SECTIONS.forEach(({ key, isBlogsDetail }) => {
      const sectionData = banners[key as keyof BannersData];
      
      // Handle blogsDetail section separately
      if (isBlogsDetail && key === 'blogsDetail') {
        const blogsData = sectionData as BlogsDetailData;
        urls[key] = {
          desktop: blogsData?.image && blogsData.image.trim() !== '' ? getImageUrl(blogsData.image) : '',
          mobile: blogsData?.mobileimage && blogsData.mobileimage.trim() !== '' ? getImageUrl(blogsData.mobileimage) : ''
        };
      } else {
        // Regular banner sections
        const bannerData = sectionData as BannerSectionData;
        // Ensure we only use valid, non-empty image paths
        const desktopImage = bannerData?.banner && bannerData.banner.trim() !== '' 
          ? getImageUrl(bannerData.banner) 
          : '';
        const mobileImage = bannerData?.mobilebanner && bannerData.mobilebanner.trim() !== '' 
          ? getImageUrl(bannerData.mobilebanner) 
          : '';
          
        urls[key] = {
          desktop: desktopImage,
          mobile: mobileImage
        };
      }
    });
    return urls;
  }, [banners]);

  // Memoized loading states for better performance
  const loadingStates = useMemo(() => ({
    isAnyUploading: BANNER_SECTIONS.some(({ key }) => 
      loading === `upload-${key}-banner` || loading === `upload-${key}-mobilebanner`
    ),
    isAnyDeleting: BANNER_SECTIONS.some(({ key }) => 
      loading === `delete-${key}-banner` || loading === `delete-${key}-mobilebanner`
    ),
    isAnyAltUpdating: BANNER_SECTIONS.some(({ key }) => 
      loading === `alt-${key}`
    )
  }), [loading]);

  // Show success modal with details
  // Show success modal - Optimized with useCallback
  const showSuccessModal = useCallback((title: string, message: string, details?: SuccessModalProps['details']) => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
      details
    });
  }, []);

  // Close success modal - Optimized with useCallback
  const closeSuccessModal = useCallback(() => {
    setSuccessModal({
      isOpen: false,
      title: '',
      message: '',
      details: undefined
    });
    
    // Scroll back to the section that was just updated
    if (lastUploadedSectionRef.current) {
      const sectionElement = document.getElementById(`section-${lastUploadedSectionRef.current}`);
      if (sectionElement) {
        setTimeout(() => {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      lastUploadedSectionRef.current = null;
    }
  }, []);

  // Fetch all banners with enhanced error handling
  const fetchBanners = useCallback(async (retryCount = 0) => {
    setLoading('fetch-all');
    setError('');
      try {
      const response = await getBanners();
      
      if (response.success && response.data) {
        setBanners(response.data);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(response.error || 'Failed to fetch banners');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to load banners:', errorMessage);
      
      // Retry mechanism for network issues
      if (retryCount < 2) {
        setTimeout(() => fetchBanners(retryCount + 1), 1000);
        return;
      }
      
      setError(`Failed to load banners: ${errorMessage}`);
    } finally {
      setLoading('');
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  // Load existing banners from API on component mount
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Debug effect to log banners state changes
  useEffect(() => {
    if (Object.keys(banners).length > 0) {
      // Banners state updated (verbose logging removed)
      // Initialize blogsDetail title and description
      if (banners.blogsDetail) {
        const blogsData = banners.blogsDetail as BlogsDetailData;
        setLocalBlogsTitle(blogsData.title || '');
        setLocalBlogsDescription(blogsData.description || '');
      }
    }
  }, [banners]);



  // Upload image for a specific section and field
  // Handle image upload - Optimized with useCallback
  const handleImageUpload = useCallback(async (section: string, field: 'banner' | 'mobilebanner' | 'image' | 'mobileimage', file: File) => {
    setLoading(`upload-${section}-${field}`);
    setError('');
    setSuccess('');
    
    // Store the section being uploaded
    lastUploadedSectionRef.current = section;
    
    try {
      const altText = banners[section as keyof BannersData]?.alt || '';
      const response = await uploadBannerImage(section, field, file, altText);
      
      if (response.success) {
        // Update local state directly instead of fetching all data (prevents 429 errors)
        setBanners(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof BannersData],
            [field]: (response.data as { imageUrl?: string; filename?: string })?.imageUrl || 
                     (response.data as { imageUrl?: string; filename?: string })?.filename || '',
            [`${field}Metadata`]: (response.data as { metadata?: unknown })?.metadata
          }
        }));
        
        // Show enhanced success modal with details
        showSuccessModal(
          'Upload Successful!',
          response.message || 'Image uploaded successfully',
          {
            section: (response.data as { section?: string })?.section,
            field: (response.data as { field?: string })?.field,
            imageUrl: (response.data as { imageUrl?: string })?.imageUrl,
            metadata: (response.data as { metadata?: { originalName?: string; size?: number; filename?: string } })?.metadata
          }
        );
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading('');
    }
  }, [banners, showSuccessModal]);

  // Update alt text for a section
  const handleAltUpdate = async (section: string, alt: string) => {
    setLoading(`alt-${section}`);
    setError('');
    setSuccess('');
    
    try {
      const response = await updateBannerAlt(section, alt);
      
      if (response.success) {
        // Update local state directly instead of fetching all data (prevents 429 errors)
        setBanners(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof BannersData],
            alt: alt
          }
        }));
        
        // Clear local state after successful update
        setLocalAltTexts(prev => {
          const newState = { ...prev };
          delete newState[section];
          return newState;
        });
        
        // Show success modal with details
        showSuccessModal(
          'Alt Text Updated!',
          response.message || 'Alt text updated successfully',
          {
            section: (response.data as { section?: string })?.section,
            field: 'alt'
          }
        );
      } else {
        setError(response.error || 'Update failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Update failed: ${errorMessage}`);
    } finally {
      setLoading('');
    }
  };

  // Update BlogsDetail title and description
  const handleBlogsTextUpdate = useCallback(async () => {
    setLoading('blogstext-update');
    setError('');
    setSuccess('');
    
    try {
      // Call API to save to backend
      const response = await updateBlogsDetailText(localBlogsTitle, localBlogsDescription);
      
      if (response.success) {
        // Update local banners state with new values
        setBanners(prev => ({
          ...prev,
          blogsDetail: {
            ...(prev.blogsDetail as BlogsDetailData),
            title: localBlogsTitle,
            description: localBlogsDescription
          }
        }));
        
        // Show success modal
        setSuccessModal({
          isOpen: true,
          title: 'Blogs Text Updated',
          message: `Blog title and description have been successfully updated.${localBlogsTitle ? '\n\nTitle: ' + localBlogsTitle : ''}${localBlogsDescription ? '\n\nDescription: ' + (localBlogsDescription.length > 100 ? localBlogsDescription.substring(0, 100) + '...' : localBlogsDescription) : ''}`
        });
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Update failed: ${errorMessage}`);
    } finally {
      setLoading('');
    }
  }, [localBlogsTitle, localBlogsDescription]);

  // Check if blogsDetail text has unsaved changes
  const hasBlogsTextChanges = useCallback(() => {
    const blogsData = banners.blogsDetail as BlogsDetailData;
    return localBlogsTitle !== (blogsData?.title || '') || 
           localBlogsDescription !== (blogsData?.description || '');
  }, [banners.blogsDetail, localBlogsTitle, localBlogsDescription]);

  // Delete image for a specific section and field
  const handleImageDelete = async (section: string, field: 'banner' | 'mobilebanner' | 'image' | 'mobileimage') => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setLoading(`delete-${section}-${field}`);
    setError('');
    setSuccess('');
    
    try {
      const response = await deleteBannerImage(section, field);
      
      if (response.success) {
        // Update local state directly instead of fetching all data (prevents 429 errors)
        setBanners(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof BannersData],
            [field]: '',
            [`${field}Metadata`]: undefined
          }
        }));
        
        // Show success modal with details
        showSuccessModal(
          'Image Deleted!',
          response.message || 'Image deleted successfully',
          {
            section: (response.data as { section?: string })?.section,
            field: (response.data as { field?: string })?.field
          }
        );
      } else {
        setError(response.error || 'Delete failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Delete failed: ${errorMessage}`);
    } finally {
      setLoading('');
    }
  };

  // Show preview modal
  const showPreview = (image: string, alt: string) => {
    setPreviewModal({ show: true, image, alt });
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewModal({ show: false, image: '', alt: '' });
  };

  // Handle alt text change locally (no API call) - Optimized with useCallback
  const handleAltTextChange = useCallback((section: string, value: string) => {
    setLocalAltTexts(prev => ({
      ...prev,
      [section]: value
    }));
  }, []);

  // Get alt text for display (local first, then from banners)
  const getAltText = (section: string): string => {
    return localAltTexts[section] ?? banners[section as keyof BannersData]?.alt ?? '';
  };

  // Check if alt text has unsaved changes
  const hasUnsavedAltChanges = (section: string): boolean => {
    const localAlt = localAltTexts[section];
    const serverAlt = banners[section as keyof BannersData]?.alt ?? '';
    return localAlt !== undefined && localAlt !== serverAlt;
  };

  // Handle file input change
  // Handle file selection - Optimized with useCallback
  const handleFileChange = useCallback((section: string, field: 'banner' | 'mobilebanner' | 'image' | 'mobileimage', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(section, field, file);
    }
  }, [handleImageUpload]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
          {/* Global Loading Indicator */}
          {(loadingStates.isAnyUploading || loadingStates.isAnyDeleting || loadingStates.isAnyAltUpdating || loading === 'fetch-all') && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                {loading === 'fetch-all' ? 'Loading banners...' :
                 loadingStates.isAnyUploading ? 'Uploading...' :
                 loadingStates.isAnyDeleting ? 'Deleting...' :
                 loadingStates.isAnyAltUpdating ? 'Updating alt text...' : 'Processing...'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 text-green-500 shrink-0">✓</div>
          <span className="text-green-700">{success}</span>
          <button 
            onClick={() => setSuccess('')}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Sections Grid */}
      <div className="grid gap-8">
        {BANNER_SECTIONS.map(({ key, label, isBlogsDetail }) => {
          const sectionData = banners[key as keyof BannersData];
          
          // Render BlogsDetail section separately
          if (isBlogsDetail && key === 'blogsDetail') {
            const blogsData = sectionData as BlogsDetailData;
            return (
              <div key={key} id={`section-${key}`} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">{label}</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Desktop Image Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Desktop Image</h3>
                    
                    {blogsData?.image ? (
                      <div className="relative group">
                        <LazyImage 
                          src={memoizedImageUrls[key]?.desktop || ''} 
                          alt={blogsData?.alt || 'Blogs desktop image'}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        
                        {/* Image metadata overlay */}
                        {blogsData.imageMetadata && (
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {blogsData.imageMetadata.size && 
                              formatFileSize(blogsData.imageMetadata.size)
                            }
                            {blogsData.imageMetadata.uploadedAt && (
                              <div>
                                {formatUploadDate(blogsData.imageMetadata.uploadedAt)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-3">
                            <button
                              onClick={() => showPreview(getImageUrl(blogsData.image), blogsData.alt || '')}
                              className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleImageDelete(key, 'image')}
                              disabled={loading === `delete-${key}-image`}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {loading === `delete-${key}-image` ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No desktop image uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(key, 'image', e)}
                          className="hidden"
                        />
                        <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          {loading === `upload-${key}-image` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {blogsData?.image ? 'Replace' : 'Upload'} Desktop
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Mobile Image Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Mobile Image</h3>
                    
                    {blogsData?.mobileimage ? (
                      <div className="relative group">
                        <LazyImage 
                          src={memoizedImageUrls[key]?.mobile || ''} 
                          alt={blogsData?.alt || 'Blogs mobile image'}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        
                        {/* Image metadata overlay */}
                        {blogsData.mobileimageMetadata && (
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {blogsData.mobileimageMetadata.size && 
                              formatFileSize(blogsData.mobileimageMetadata.size)
                            }
                            {blogsData.mobileimageMetadata.uploadedAt && (
                              <div>
                                {formatUploadDate(blogsData.mobileimageMetadata.uploadedAt)}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-3">
                            <button
                              onClick={() => showPreview(getImageUrl(blogsData.mobileimage), blogsData.alt || '')}
                              className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleImageDelete(key, 'mobileimage')}
                              disabled={loading === `delete-${key}-mobileimage`}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              {loading === `delete-${key}-mobileimage` ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No mobile image uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(key, 'mobileimage', e)}
                          className="hidden"
                        />
                        <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          {loading === `upload-${key}-mobileimage` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {blogsData?.mobileimage ? 'Replace' : 'Upload'} Mobile
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Alt Text, Title and Description Section */}
                <div className="space-y-6">
                  {/* Alt Text Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Alt Text (for accessibility)
                      {hasUnsavedAltChanges(key) && (
                        <span className="ml-2 text-sm text-orange-600 font-normal">• Unsaved changes</span>
                      )}
                    </h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={getAltText(key)}
                        onChange={(e) => handleAltTextChange(key, e.target.value)}
                        placeholder="Enter descriptive alt text for screen readers..."
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          hasUnsavedAltChanges(key) 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      <button
                        onClick={() => {
                          const altText = getAltText(key);
                          handleAltUpdate(key, altText);
                        }}
                        disabled={loading === `alt-${key}` || !getAltText(key) || !hasUnsavedAltChanges(key)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading === `alt-${key}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Alt Text
                      </button>
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Title
                      {hasBlogsTextChanges() && (
                        <span className="ml-2 text-sm text-orange-600 font-normal">• Unsaved changes</span>
                      )}
                    </h3>
                    <input
                      type="text"
                      value={localBlogsTitle}
                      onChange={(e) => setLocalBlogsTitle(e.target.value)}
                      placeholder="Enter blog title..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        hasBlogsTextChanges() 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Description Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Description</h3>
                    <textarea
                      value={localBlogsDescription}
                      onChange={(e) => setLocalBlogsDescription(e.target.value)}
                      placeholder="Enter blog description..."
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        hasBlogsTextChanges() 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Save Button for Title & Description */}
                  {hasBlogsTextChanges() && (
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={handleBlogsTextUpdate}
                        disabled={loading === 'blogstext-update'}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading === 'blogstext-update' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Title & Description
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Regular banner sections
          const bannerData = sectionData as BannerSectionData;
          
          return (
            <div key={key} id={`section-${key}`} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{label}</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Desktop Banner */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Desktop Banner</h3>
                  
                  {bannerData?.banner ? (
                    <div className="relative group">
                      <LazyImage 
                        src={memoizedImageUrls[key]?.desktop || ''} 
                        alt={bannerData.alt || 'Desktop banner'}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        onLoad={() => {
                          console.info('✅ Successfully loaded image:', memoizedImageUrls[key]?.desktop);
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load image:', {
                            originalPath: bannerData.banner,
                            fullUrl: memoizedImageUrls[key]?.desktop,
                            error: e
                          });
                        }}
                      />
                      
                      {/* Image metadata overlay */}
                      {bannerData.bannerMetadata && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {bannerData.bannerMetadata.size && 
                            formatFileSize(bannerData.bannerMetadata.size)
                          }
                          {bannerData.bannerMetadata.uploadedAt && (
                            <div>
                              {formatUploadDate(bannerData.bannerMetadata.uploadedAt)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-3">
                          <button
                            onClick={() => showPreview(getImageUrl(bannerData.banner), bannerData.alt || '')}
                            className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleImageDelete(key, 'banner')}
                            disabled={loading === `delete-${key}-banner`}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {loading === `delete-${key}-banner` ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No desktop banner uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(key, 'banner', e)}
                        className="hidden"
                      />
                      <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        {loading === `upload-${key}-banner` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {bannerData?.banner ? 'Replace' : 'Upload'} Desktop
                      </span>
                    </label>
                  </div>
                </div>

                {/* Mobile Banner */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Mobile Banner</h3>
                  
                  {bannerData?.mobilebanner ? (
                    <div className="relative group">
                      <LazyImage 
                        src={memoizedImageUrls[key]?.mobile || ''} 
                        alt={bannerData.alt || 'Mobile banner'}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        onLoad={() => {
                          console.info('✅ Successfully loaded mobile image:', memoizedImageUrls[key]?.mobile);
                        }}
                        onError={(e) => {
                          console.error('❌ Failed to load mobile image:', {
                            originalPath: bannerData.mobilebanner,
                            fullUrl: memoizedImageUrls[key]?.mobile,
                            error: e
                          });
                        }}
                      />
                      
                      {/* Image metadata overlay */}
                      {bannerData.mobilebannerMetadata && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {bannerData.mobilebannerMetadata.size && 
                            formatFileSize(bannerData.mobilebannerMetadata.size)
                          }
                          {bannerData.mobilebannerMetadata.uploadedAt && (
                            <div>
                              {formatUploadDate(bannerData.mobilebannerMetadata.uploadedAt)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-3">
                          <button
                            onClick={() => showPreview(getImageUrl(bannerData.mobilebanner), bannerData.alt || '')}
                            className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleImageDelete(key, 'mobilebanner')}
                            disabled={loading === `delete-${key}-mobilebanner`}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {loading === `delete-${key}-mobilebanner` ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No mobile banner uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(key, 'mobilebanner', e)}
                        className="hidden"
                      />
                      <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        {loading === `upload-${key}-mobilebanner` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {bannerData?.mobilebanner ? 'Replace' : 'Upload'} Mobile
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Alt Text Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Alt Text (for accessibility)
                  {hasUnsavedAltChanges(key) && (
                    <span className="ml-2 text-sm text-orange-600 font-normal">• Unsaved changes</span>
                  )}
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={getAltText(key)}
                    onChange={(e) => handleAltTextChange(key, e.target.value)}
                    placeholder="Enter descriptive alt text for screen readers..."
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      hasUnsavedAltChanges(key) 
                        ? 'border-orange-300 bg-orange-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  <button
                    onClick={() => {
                      const altText = getAltText(key);
                      handleAltUpdate(key, altText);
                    }}
                    disabled={loading === `alt-${key}` || !getAltText(key) || !hasUnsavedAltChanges(key)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading === `alt-${key}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Alt Text
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewModal.image}
                alt={previewModal.alt}
                className="max-w-full max-h-96 object-contain mx-auto"
              />
              {previewModal.alt && (
                <p className="mt-4 text-gray-600 text-center">
                  <strong>Alt Text:</strong> {previewModal.alt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
        details={successModal.details}
      />
    </div>
  );
};

export default BannerManagement;