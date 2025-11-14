/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getProjectById, updateProject } from '../../api';
import { getImageUrl } from '../../api/imageUtils';
import SuccessModal from '../../components/modals/SuccessModal';
import { Toast } from '../../components/modals';
import { ArrowLeft, Upload, X, FileText, Plus } from 'lucide-react';

// Types matching ProjectsPage structure
type ProjectState = 'on-going' | 'completed';
type ProjectType = 'residential' | 'commercial' | 'plot';
type HouseStatus = 'Ready to Move' | 'Sample House Ready';

type ImageItem = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
  isExisting?: boolean;
};

type FloorPlan = {
  id: string;
  title: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
  isExisting?: boolean;
};

type Amenity = {
  id: string;
  title: string;
  svgOrImage: string;
  alt: string;
  file?: File;
  preview?: string;
  isExisting?: boolean;
};

interface ProjectFormData {
  projectTitle: string;
  slug: string;
  projectType: ProjectType;
  projectState: ProjectState;
  cardAreaFt: string;
  cardLocation: string;
  shortAddress: string;
  projectStatusPercentage: number;
  
  // Banner Section
  bannerSection: {
    desktopBannerImage: string;
    mobileBannerImage: string;
    alt: string;
    desktopBannerFile?: File;
    mobileBannerFile?: File;
    desktopPreview?: string;
    mobilePreview?: string;
    existingDesktopBanner?: string;
    existingMobileBanner?: string;
  };
  
  // About Us Details
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  aboutImageAlt: string;
  aboutImage: File | null;
  existingAboutImage?: string;
  deleteAboutImage: boolean;
  
  // Card Image
  cardImage: File | null;
  cardImagePreview?: string;
  existingCardImage?: string;
  deleteCardImage: boolean;
  cardProjectType: ProjectType;
  cardHouse: HouseStatus;
  
  // Brochure
  brochure: File | null;
  existingBrochure?: string;
  deleteBrochure: boolean;
  
  // Floor Plans
  floorPlans: FloorPlan[];
  deleteFloorPlans: string[];
  
  // Project Images (Gallery)
  projectImages: ImageItem[];
  deleteProjectImages: string[];
  
  // Amenities
  amenities: Amenity[];
  deleteAmenities: string[];
  
  // Updated Images
  updatedImagesTitle: string;
  updatedImages: ImageItem[];
  deleteUpdatedImages: string[];
  
  // Location & Contact
  youtubeUrl: string;
  locationTitle: string;
  locationTitleText: string;
  locationArea: string;
  number1: string;
  number2: string;
  email1: string;
  email2: string;
  mapIframeUrl: string;
  reraNumber: string;
  
  isActive: boolean;
}

export default function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  
  const [formData, setFormData] = useState<ProjectFormData>({
    projectTitle: '',
    slug: '',
    projectType: 'residential',
    projectState: 'on-going',
    cardAreaFt: '',
    cardLocation: '',
    shortAddress: '',
    projectStatusPercentage: 0,
    bannerSection: {
      desktopBannerImage: '',
      mobileBannerImage: '',
      alt: '',
    },
    description1: '',
    description2: '',
    description3: '',
    description4: '',
    aboutImageAlt: '',
    aboutImage: null,
    deleteAboutImage: false,
    cardImage: null,
    deleteCardImage: false,
    cardProjectType: 'residential',
    cardHouse: 'Ready to Move',
    brochure: null,
    deleteBrochure: false,
    floorPlans: [],
    deleteFloorPlans: [],
    projectImages: [],
    deleteProjectImages: [],
    amenities: [],
    deleteAmenities: [],
    updatedImagesTitle: '',
    updatedImages: [],
    deleteUpdatedImages: [],
    youtubeUrl: '',
    locationTitle: '',
    locationTitleText: '',
    locationArea: '',
    number1: '',
    number2: '',
    email1: '',
    email2: '',
    mapIframeUrl: '',
    reraNumber: '',
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      if (!id) {
        console.error('❌ No project ID provided');
        return;
      }
      
      try {
        setLoading(true);
        
        const response = await getProjectById(id);
        
        if (!response.success) {
          setError(response.message || 'Failed to load project');
          console.error('❌ API Error:', response.message);
          return;
        }
        
        const project = response.data as any; // Temporarily using any for banner section
        
        if (!project) {
          setError('Project not found');
          console.error('❌ No project data in response');
          return;
        }
        
        setFormData({
          projectTitle: project.projectTitle || '',
          slug: project.slug || '',
          projectType: project.projectType || 'residential',
          projectState: project.projectState || 'on-going',
          cardAreaFt: project.cardAreaFt || '',
          cardLocation: project.cardLocation || '',
          shortAddress: project.shortAddress || '',
          projectStatusPercentage: project.projectStatusPercentage || 0,
          bannerSection: {
            desktopBannerImage: project.bannerSection?.desktopBannerImage || '',
            mobileBannerImage: project.bannerSection?.mobileBannerImage || '',
            alt: project.bannerSection?.alt || '',
            existingDesktopBanner: project.bannerSection?.desktopBannerImage,
            existingMobileBanner: project.bannerSection?.mobileBannerImage,
          },
          description1: project.aboutUsDetail?.description1 || '',
          description2: project.aboutUsDetail?.description2 || '',
          description3: project.aboutUsDetail?.description3 || '',
          description4: project.aboutUsDetail?.description4 || '',
          aboutImageAlt: project.aboutUsDetail?.image?.alt || '',
          aboutImage: null,
          existingAboutImage: project.aboutUsDetail?.image?.url,
          deleteAboutImage: false,
          cardImage: null,
          cardImagePreview: undefined,
          existingCardImage: project.cardImage,
          deleteCardImage: false,
          cardProjectType: project.cardProjectType || project.projectType || 'residential',
          cardHouse: project.cardHouse || 'Ready to Move',
          brochure: null,
          existingBrochure: project.brochure,
          deleteBrochure: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          floorPlans: (project.floorPlans || []).map((fp: any) => ({
            ...fp,
            id: fp.id || fp._id,
            isExisting: true,
          })),
          deleteFloorPlans: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          projectImages: (project.projectImages || []).map((img: any) => ({
            ...img,
            id: img.id || img._id,
            isExisting: true,
          })),
          deleteProjectImages: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          amenities: (project.amenities || []).map((am: any) => ({
            ...am,
            id: am.id || am._id,
            isExisting: true,
          })),
          deleteAmenities: [],
          updatedImagesTitle: project.updatedImagesTitle || '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updatedImages: (project.updatedImages || []).map((img: any) => ({
            ...img,
            id: img.id || img._id,
            isExisting: true,
          })),
          deleteUpdatedImages: [],
          youtubeUrl: project.youtubeUrl || '',
          locationTitle: project.locationTitle || '',
          locationTitleText: project.locationTitleText || '',
          locationArea: project.locationArea || '',
          number1: project.number1 || '',
          number2: project.number2 || '',
          email1: project.email1 || '',
          email2: project.email2 || '',
          mapIframeUrl: project.mapIframeUrl || '',
          reraNumber: project.reraNumber || '',
          isActive: project.isActive ?? true,
        });
        
        
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load project:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id]);

  // Input change handlers - optimized with useCallback to prevent re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  // About Image handlers - optimized
  const handleAboutImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        aboutImage: file,
        deleteAboutImage: false,
      }));
    }
  }, []);

  const handleRemoveAboutImage = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      aboutImage: null,
      existingAboutImage: undefined,
      deleteAboutImage: true,
    }));
  }, []);

  // Card Image handlers - optimized
  const handleCardImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        cardImage: file,
        cardImagePreview: preview,
        deleteCardImage: false,
      }));
    }
  }, []);

  const handleRemoveCardImage = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      cardImage: null,
      cardImagePreview: undefined,
      existingCardImage: undefined,
      deleteCardImage: true,
    }));
  }, []);

  // Brochure handlers - optimized
  const handleBrochureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        brochure: e.target.files![0],
        deleteBrochure: false,
      }));
    }
  }, []);

  const handleRemoveBrochure = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      brochure: null,
      existingBrochure: undefined,
      deleteBrochure: true,
    }));
  }, []);

  // Floor Plans handlers - optimized
  const handleAddFloorPlan = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      floorPlans: [...prev.floorPlans, { id: Date.now().toString(), title: '', image: '', alt: '' }],
    }));
  }, []);

  const handleRemoveFloorPlan = useCallback((id: string, isExisting?: boolean) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.filter(fp => fp.id !== id),
      deleteFloorPlans: isExisting ? [...prev.deleteFloorPlans, id] : prev.deleteFloorPlans,
    }));
  }, []);

  const handleFloorPlanChange = useCallback((id: string, field: 'title' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => (fp.id === id ? { ...fp, [field]: value } : fp)),
    }));
  }, []);

  const handleFloorPlanImageChange = useCallback((id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => (fp.id === id ? { ...fp, file, preview } : fp)),
    }));
  }, []);

  // Project Images (Gallery) handlers - optimized
  const handleAddProjectImage = useCallback(() => {
    setFormData(prev => {
      if (prev.projectImages.length >= 5) {
        setToastMessage('Maximum 5 project images allowed');
        setToastType('warning');
        setShowToast(true);
        return prev;
      }
      return {
        ...prev,
        projectImages: [...prev.projectImages, { id: Date.now().toString(), image: '', alt: '' }],
      };
    });
  }, []);

  const handleRemoveProjectImage = useCallback((id: string, isExisting?: boolean) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.filter(img => img.id !== id),
      deleteProjectImages: isExisting ? [...prev.deleteProjectImages, id] : prev.deleteProjectImages,
    }));
  }, []);

  const handleProjectImageChange = useCallback((id: string, field: 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  }, []);

  const handleProjectImageFileChange = useCallback((id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => (img.id === id ? { ...img, file, preview } : img)),
    }));
  }, []);

  // Amenities handlers - optimized
  const handleAddAmenity = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, { id: Date.now().toString(), title: '', svgOrImage: '', alt: '' }],
    }));
  }, []);

  const handleRemoveAmenity = useCallback((id: string, isExisting?: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(am => am.id !== id),
      deleteAmenities: isExisting ? [...prev.deleteAmenities, id] : prev.deleteAmenities,
    }));
  }, []);

  const handleAmenityChange = useCallback((id: string, field: 'title' | 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => (am.id === id ? { ...am, [field]: value } : am)),
    }));
  }, []);

  const handleAmenityImageChange = useCallback((id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => (am.id === id ? { ...am, file, preview } : am)),
    }));
  }, []);

  // Updated Images handlers - optimized
  const handleAddUpdatedImage = useCallback(() => {
    setFormData(prev => {
      if (prev.updatedImages.length >= 3) {
        setToastMessage('Maximum 3 updated images allowed');
        setToastType('warning');
        setShowToast(true);
        return prev;
      }
      return {
        ...prev,
        updatedImages: [...prev.updatedImages, { id: Date.now().toString(), image: '', alt: '' }],
      };
    });
  }, []);

  const handleRemoveUpdatedImage = useCallback((id: string, isExisting?: boolean) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.filter(img => img.id !== id),
      deleteUpdatedImages: isExisting ? [...prev.deleteUpdatedImages, id] : prev.deleteUpdatedImages,
    }));
  }, []);

  const handleUpdatedImageChange = useCallback((id: string, field: 'alt', value: string) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  }, []);

  const handleUpdatedImageFileChange = useCallback((id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => (img.id === id ? { ...img, file, preview } : img)),
    }));
  }, []);


  // Form submission - optimized to only send updated data
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('Project ID not found');
      return;
    }

    // Validation
    if (!formData.projectTitle.trim()) {
      setError('Project title is required');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }
    if (!formData.shortAddress.trim()) {
      setError('Short address is required');
      return;
    }
    if (!formData.description1.trim()) {
      setError('Description 1 is required');
      return;
    }
    if (!formData.locationTitle.trim()) {
      setError('Location title is required');
      return;
    }
    if (!formData.locationTitleText.trim()) {
      setError('Location title text is required');
      return;
    }
    if (!formData.mapIframeUrl.trim()) {
      setError('Map iframe URL is required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const submitData = new FormData();
      
      // Basic fields - always send these as they might have changed
      submitData.append('projectTitle', formData.projectTitle.trim());
      submitData.append('slug', formData.slug.trim());
      submitData.append('projectType', formData.projectType);
      submitData.append('projectState', formData.projectState);
      submitData.append('cardAreaFt', formData.cardAreaFt.trim());
      submitData.append('cardLocation', formData.cardLocation.trim());
      submitData.append('shortAddress', formData.shortAddress.trim());
      submitData.append('projectStatusPercentage', formData.projectStatusPercentage.toString());
      submitData.append('isActive', String(formData.isActive));
      
      // About Us Details - send as flat fields, backend will restructure
      submitData.append('description1', formData.description1.trim());
      submitData.append('description2', formData.description2.trim());
      submitData.append('description3', formData.description3.trim());
      submitData.append('description4', formData.description4.trim());
      submitData.append('aboutUsAlt', formData.aboutImageAlt.trim());
      
      // Banner Section
      submitData.append('bannerAlt', formData.bannerSection.alt.trim());
      if (formData.bannerSection.desktopBannerFile) {
        submitData.append('desktopBannerFile', formData.bannerSection.desktopBannerFile);
      }
      if (formData.bannerSection.mobileBannerFile) {
        submitData.append('mobileBannerFile', formData.bannerSection.mobileBannerFile);
      }
      
      // Only send about image if new image or delete flag
      if (formData.aboutImage) {
        submitData.append('aboutUsImage', formData.aboutImage);
      }
      if (formData.deleteAboutImage) {
        submitData.append('deleteAboutImage', 'true');
      }
      
      // Only send card image if new image or delete flag
      if (formData.cardImage) {
        submitData.append('cardImage', formData.cardImage);
      }
      if (formData.deleteCardImage) {
        submitData.append('deleteCardImage', 'true');
      }
      submitData.append('cardProjectType', formData.cardProjectType);
      submitData.append('cardHouse', formData.cardHouse);
      
      // Only send brochure if new file or delete flag
      if (formData.brochure) {
        submitData.append('brochure', formData.brochure);
      }
      if (formData.deleteBrochure) {
        submitData.append('deleteBrochure', 'true');
      }
      
      // Floor Plans - send deletions
      formData.deleteFloorPlans.forEach(id => {
        submitData.append('deleteFloorPlans[]', id);
      });
      
      // Floor Plans - send all current floor plans (existing + new)
      const allFloorPlans = formData.floorPlans.map(fp => ({
        id: fp.id,
        title: fp.title.trim(),
        alt: fp.alt.trim(),
        image: fp.image || '',
        hasNewFile: !!fp.file
      }));
      submitData.append('floorPlans', JSON.stringify(allFloorPlans));
      
      // Floor Plan images - only send new files
      formData.floorPlans.forEach((fp) => {
        if (fp.file) {
          submitData.append('floorPlanImages', fp.file!);
        }
      });
      
      // Project Images - send deletions
      formData.deleteProjectImages.forEach(id => {
        submitData.append('deleteProjectImages[]', id);
      });
      
      // Project Images - send all current images (existing + new)
      const allProjectImages = formData.projectImages.map(img => ({
        id: img.id,
        alt: img.alt.trim(),
        image: img.image || '',
        hasNewFile: !!img.file
      }));
      submitData.append('projectImages', JSON.stringify(allProjectImages));
      
      // Project image files - only send new files
      formData.projectImages.forEach((img) => {
        if (img.file) {
          submitData.append('projectImageFiles', img.file!);
        }
      });
      
      // Amenities - send deletions
      formData.deleteAmenities.forEach(id => {
        submitData.append('deleteAmenities[]', id);
      });
      
      // Amenities - send all current amenities (existing + new)
      const allAmenities = formData.amenities.map(am => ({
        id: am.id,
        title: am.title.trim(),
        alt: am.alt.trim(),
        svgOrImage: am.svgOrImage || '',
        hasNewFile: !!am.file
      }));
      submitData.append('amenities', JSON.stringify(allAmenities));
      
      // Amenity images - only send new files
      formData.amenities.forEach((am) => {
        if (am.file) {
          submitData.append('amenityFiles', am.file!);
        }
      });
      
      // Updated Images
      submitData.append('updatedImagesTitle', formData.updatedImagesTitle.trim());
      formData.deleteUpdatedImages.forEach(id => {
        submitData.append('deleteUpdatedImages[]', id);
      });
      
      // Updated Images - send all current images (existing + new)
      const allUpdatedImages = formData.updatedImages.map(img => ({
        id: img.id,
        alt: img.alt.trim(),
        image: img.image || '',
        hasNewFile: !!img.file
      }));
      submitData.append('updatedImages', JSON.stringify(allUpdatedImages));
      
      // Updated image files - only send new files
      formData.updatedImages.forEach((img) => {
        if (img.file) {
          submitData.append('updatedImageFiles', img.file!);
        }
      });
      
      // Location & Contact - YouTube URL is optional now
      submitData.append('youtubeUrl', formData.youtubeUrl.trim());
      submitData.append('locationTitle', formData.locationTitle.trim());
      submitData.append('locationTitleText', formData.locationTitleText.trim());
      submitData.append('locationArea', formData.locationArea.trim());
      submitData.append('number1', formData.number1.trim());
      submitData.append('number2', formData.number2.trim());
      submitData.append('email1', formData.email1.trim());
      submitData.append('email2', formData.email2.trim());
      submitData.append('mapIframeUrl', formData.mapIframeUrl.trim());
      submitData.append('reraNumber', formData.reraNumber.trim());
      
      const response = await updateProject(id, submitData);
      
      if (!response.success) {
        console.error('❌ Update failed:', response.message);
        if (response.errors && Array.isArray(response.errors)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorMessages = response.errors.map((err: any) => `${err.param}: ${err.msg}`).join('\n');
          setError(`Validation failed:\n${errorMessages}`);
        } else {
          setError(response.message || 'Failed to update project');
        }
        return;
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.error('❌ Failed to update project:', err);
      setError('Failed to update project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [id, formData, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-gray-600">Loading project details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update project information and images</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter project title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Type</option>
                <option value="residential">🏠 Residential</option>
                <option value="commercial">🏢 Commercial</option>
                <option value="plot">📐 Plots</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project State <span className="text-red-500">*</span>
              </label>
              <select
                name="projectState"
                value={formData.projectState}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select State</option>
                <option value="on-going">🚧 On-Going</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Area (sq ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardAreaFt"
                value={formData.cardAreaFt}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., 2500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cardLocation"
                value={formData.cardLocation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., Indore, MP"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shortAddress"
                value={formData.shortAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Brief address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="project-slug-url"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Completion % <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="projectStatusPercentage"
                  value={formData.projectStatusPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <span className="text-gray-600 font-medium">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Project Type
              </label>
              <input
                type="text"
                name="cardProjectType"
                value={formData.cardProjectType}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., Luxury Apartments"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                House Status
              </label>
              <select
                name="cardHouse"
                value={formData.cardHouse}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="Ready to Move">Ready to Move</option>
                <option value="Sample House Ready">Sample House Ready</option>
              </select>
            </div>
            
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-semibold text-gray-900 cursor-pointer">
                ✓ Project is Active
              </label>
            </div>
          </div>
        </div>
        
        {/* Banner Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Banner Section</h2>
          
          <div className="space-y-6">
            {/* Desktop Banner Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Desktop Banner Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                {(formData.bannerSection.desktopPreview || formData.bannerSection.existingDesktopBanner) ? (
                  <div className="relative">
                    <img 
                      src={formData.bannerSection.desktopPreview || getImageUrl(formData.bannerSection.existingDesktopBanner)} 
                      alt="Desktop Banner Preview" 
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          bannerSection: {
                            ...prev.bannerSection,
                            desktopBannerFile: undefined,
                            desktopPreview: undefined,
                          }
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setFormData(prev => ({
                            ...prev,
                            bannerSection: {
                              ...prev.bannerSection,
                              desktopBannerFile: file,
                              desktopPreview: preview,
                            }
                          }));
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload desktop banner image</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Mobile Banner Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Mobile Banner Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                {(formData.bannerSection.mobilePreview || formData.bannerSection.existingMobileBanner) ? (
                  <div className="relative">
                    <img 
                      src={formData.bannerSection.mobilePreview || getImageUrl(formData.bannerSection.existingMobileBanner)} 
                      alt="Mobile Banner Preview" 
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          bannerSection: {
                            ...prev.bannerSection,
                            mobileBannerFile: undefined,
                            mobilePreview: undefined,
                          }
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setFormData(prev => ({
                            ...prev,
                            bannerSection: {
                              ...prev.bannerSection,
                              mobileBannerFile: file,
                              mobilePreview: preview,
                            }
                          }));
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload mobile banner image</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Alt Text *</label>
              <input
                type="text"
                name="bannerAlt"
                value={formData.bannerSection.alt}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    bannerSection: {
                      ...prev.bannerSection,
                      alt: e.target.value,
                    }
                  }));
                }}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter descriptive alt text for banner images"
              />
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">About Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description 1 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description1"
                value={formData.description1}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="First paragraph about the project"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description 2</label>
                <textarea
                  name="description2"
                  value={formData.description2}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description 3</label>
                <textarea
                  name="description3"
                  value={formData.description3}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description 4</label>
                <textarea
                  name="description4"
                  value={formData.description4}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">About Image Alt Text</label>
              <input
                type="text"
                name="aboutImageAlt"
                value={formData.aboutImageAlt}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Describe the about section image"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">About Section Image</label>
              {(formData.existingAboutImage || formData.aboutImage) && !formData.deleteAboutImage && (
                <div className="mb-3 relative inline-block">
                  <img 
                    src={formData.aboutImage ? URL.createObjectURL(formData.aboutImage) : getImageUrl(formData.existingAboutImage!)} 
                    alt="About section" 
                    className="h-40 w-60 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAboutImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                  >
                    <X size={16} />
                  </button>
                  {formData.aboutImage && (
                    <span className="absolute -bottom-6 left-0 text-xs text-green-600 font-medium">
                      New image selected: {formData.aboutImage.name}
                    </span>
                  )}
                </div>
              )}
              <div className="relative mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAboutImageChange}
                  className="hidden"
                  id="aboutImage"
                />
                <label
                  htmlFor="aboutImage"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition bg-gray-50 hover:bg-blue-50"
                >
                  <Upload size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.aboutImage || formData.existingAboutImage ? 'Change About Image' : 'Upload About Image'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Brochure */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Brochure</h2>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Brochure (PDF)</label>
            {formData.existingBrochure && !formData.deleteBrochure && (
              <div className="mb-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="text-blue-600" size={24} />
                <a 
                  href={formData.existingBrochure} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-700 hover:text-blue-900 font-medium underline"
                >
                  View Current Brochure
                </a>
                <button
                  type="button"
                  onClick={handleRemoveBrochure}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleBrochureChange}
                className="hidden"
                id="brochure"
              />
              <label
                htmlFor="brochure"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition bg-gray-50 hover:bg-blue-50"
              >
                <Upload size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Upload PDF Brochure</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Floor Plans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Floor Plans</h2>
            <button
              type="button"
              onClick={handleAddFloorPlan}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Add Floor Plan
            </button>
          </div>
          
          {formData.floorPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.floorPlans.map((fp) => (
                <div key={fp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={fp.title}
                        onChange={(e) => handleFloorPlanChange(fp.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2 BHK"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={fp.alt}
                        onChange={(e) => handleFloorPlanChange(fp.id, 'alt', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the floor plan"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Image</label>
                      {fp.preview || (fp.image && fp.isExisting) ? (
                        <div className="relative inline-block mb-2">
                          <img 
                            src={fp.preview || getImageUrl(fp.image)} 
                            alt={fp.alt} 
                            className="h-24 w-full object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFloorPlanImageChange(fp.id, file);
                        }}
                        className="hidden"
                        id={`floorPlan-${fp.id}`}
                      />
                      <label
                        htmlFor={`floorPlan-${fp.id}`}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition bg-gray-50"
                      >
                        <Upload size={16} />
                        Upload
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveFloorPlan(fp.id, fp.isExisting)}
                      className="w-full px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No floor plans added yet. Click "Add Floor Plan" to get started.</p>
          )}
        </div>
        
        {/* Project Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Project Gallery (Max 5 Images)</h2>
            <button
              type="button"
              onClick={handleAddProjectImage}
              disabled={formData.projectImages.length >= 5}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <Plus size={20} />
              Add Image
            </button>
          </div>
          
          {formData.projectImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {formData.projectImages.map((img) => (
                <div key={img.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => handleProjectImageChange(img.id, 'alt', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Image description"
                      />
                    </div>
                    
                    <div>
                      {img.preview || (img.image && img.isExisting) ? (
                        <img 
                          src={img.preview || getImageUrl(img.image)} 
                          alt={img.alt} 
                          className="h-32 w-full object-cover rounded border border-gray-200"
                        />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProjectImageFileChange(img.id, file);
                        }}
                        className="hidden"
                        id={`projectImage-${img.id}`}
                      />
                      <label
                        htmlFor={`projectImage-${img.id}`}
                        className="mt-2 flex items-center justify-center gap-1 px-2 py-1 text-xs border-2 border-dashed border-gray-300 rounded hover:border-blue-500 cursor-pointer transition bg-gray-50"
                      >
                        <Upload size={14} />
                        Upload
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveProjectImage(img.id, img.isExisting)}
                      className="w-full px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No images in gallery. Add up to 5 project images.</p>
          )}
        </div>
        
        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
            <button
              type="button"
              onClick={handleAddAmenity}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add Amenity
            </button>
          </div>
          
          {formData.amenities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.amenities.map((am) => (
                <div key={am.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={am.title}
                        onChange={(e) => handleAmenityChange(am.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Swimming Pool"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={am.alt}
                        onChange={(e) => handleAmenityChange(am.id, 'alt', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the amenity icon"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Icon/Image</label>
                      {am.preview || (am.svgOrImage && am.isExisting) ? (
                        <div className="relative inline-block mb-2">
                          <img 
                            src={am.preview || getImageUrl(am.svgOrImage)} 
                            alt={am.alt} 
                            className="h-16 w-16 object-contain rounded border border-gray-200 bg-gray-50 p-2"
                          />
                        </div>
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAmenityImageChange(am.id, file);
                        }}
                        className="hidden"
                        id={`amenity-${am.id}`}
                      />
                      <label
                        htmlFor={`amenity-${am.id}`}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition bg-gray-50"
                      >
                        <Upload size={16} />
                        Upload
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(am.id, am.isExisting)}
                      className="w-full px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No amenities added yet. Click "Add Amenity" to get started.</p>
          )}
        </div>
        
        {/* Updated Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Updated Images Section (Max 3)</h2>
            <button
              type="button"
              onClick={handleAddUpdatedImage}
              disabled={formData.updatedImages.length >= 3}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <Plus size={20} />
              Add Image
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              name="updatedImagesTitle"
              value={formData.updatedImagesTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., Latest Construction Updates"
            />
          </div>
          
          {formData.updatedImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.updatedImages.map((img) => (
                <div key={img.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => handleUpdatedImageChange(img.id, 'alt', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Image description"
                      />
                    </div>
                    
                    <div>
                      {img.preview || (img.image && img.isExisting) ? (
                        <img 
                          src={img.preview || getImageUrl(img.image)} 
                          alt={img.alt} 
                          className="h-32 w-full object-cover rounded border border-gray-200"
                        />
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpdatedImageFileChange(img.id, file);
                        }}
                        className="hidden"
                        id={`updatedImage-${img.id}`}
                      />
                      <label
                        htmlFor={`updatedImage-${img.id}`}
                        className="mt-2 flex items-center justify-center gap-1 px-2 py-1 text-xs border-2 border-dashed border-gray-300 rounded hover:border-blue-500 cursor-pointer transition bg-gray-50"
                      >
                        <Upload size={14} />
                        Upload
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveUpdatedImage(img.id, img.isExisting)}
                      className="w-full px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No updated images added yet.</p>
          )}
        </div>
        
        {/* Location & Contact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Location & Contact Information</h2>
          
          {/* Card Image */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Card Image <span className="text-red-500">*</span>
            </label>
            {formData.cardImagePreview || (formData.existingCardImage && !formData.deleteCardImage) ? (
              <div className="mb-3 relative inline-block">
                <img 
                  src={formData.cardImagePreview || getImageUrl(formData.existingCardImage)} 
                  alt="Card" 
                  className="h-40 w-60 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveCardImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : null}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCardImageChange}
                className="hidden"
                id="cardImage"
              />
              <label
                htmlFor="cardImage"
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition bg-gray-50 hover:bg-blue-50 max-w-md"
              >
                <Upload size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Upload Card Image</span>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
              <input
                type="text"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="https://youtube.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location Title</label>
              <input
                type="text"
                name="locationTitle"
                value={formData.locationTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., Prime Location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location Title Text</label>
              <input
                type="text"
                name="locationTitleText"
                value={formData.locationTitleText}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Location subtitle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location Area</label>
              <input
                type="text"
                name="locationArea"
                value={formData.locationArea}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., South Indore"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number 1</label>
              <input
                type="tel"
                name="number1"
                value={formData.number1}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="+91 1234567890"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number 2</label>
              <input
                type="tel"
                name="number2"
                value={formData.number2}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="+91 0987654321"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email 1</label>
              <input
                type="email"
                name="email1"
                value={formData.email1}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="contact@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email 2</label>
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="info@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">RERA Number</label>
              <input
                type="text"
                name="reraNumber"
                value={formData.reraNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="RERA Registration Number"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Iframe URL</label>
            <textarea
              name="mapIframeUrl"
              value={formData.mapIframeUrl}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono text-sm"
              placeholder="Paste the Google Maps embed iframe URL here"
            />
            <p className="text-xs text-gray-500 mt-1">Get the embed code from Google Maps → Share → Embed a map</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 sticky bottom-0 bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : (
              '💾 Update Project'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-300 font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
      
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        message="Project updated successfully!"
      />

      {/* Toast Notification */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        duration={4000}
      />
    </div>
  );
}
