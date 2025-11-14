import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { projectApi } from '../../api/project/projectApi';
import SuccessModal from '../../components/modals/SuccessModal';
import { Toast } from '../../components/modals';
import { SectionNavigator } from '../../components/admin/projects';
import { SectionLoading } from '../../components/LoadingComponents';

// Lazy load section components for better code splitting
const ProjectSection1 = lazy(() => import('../../components/admin/projects/ProjectSection1'));
const ProjectSection2 = lazy(() => import('../../components/admin/projects/ProjectSection2'));
const ProjectSection3 = lazy(() => import('../../components/admin/projects/ProjectSection3'));
const ProjectSection4 = lazy(() => import('../../components/admin/projects/ProjectSection4'));

type ProjectState = 'on-going' | 'completed';
type ProjectType = 'residential' | 'commercial' | 'plot';
type HouseStatus = 'Ready to Move' | 'Sample House Ready';

type ImageItem = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

type FloorPlan = {
  id: string;
  title: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

type Amenity = {
  id: string;
  title: string;
  svgOrImage: string;
  alt: string;
  file?: File;
  preview?: string;
};

type AboutUsDetail = {
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  image: {
    url: string;
    alt: string;
    file?: File;
    preview?: string;
  };
};

type BannerSection = {
  desktopBannerImage: string;
  mobileBannerImage: string;
  alt: string;
  desktopBannerFile?: File;
  mobileBannerFile?: File;
  desktopPreview?: string;
  mobilePreview?: string;
};

type FormData = {
  projectTitle: string;
  slug: string;
  brochureFile?: File;
  projectState: ProjectState;
  projectType: ProjectType;
  shortAddress: string;
  projectStatusPercentage: number;
  bannerSection: BannerSection;
  aboutUsDetail: AboutUsDetail;
  floorPlans: FloorPlan[];
  projectImages: ImageItem[];
  amenities: Amenity[];
  youtubeUrl: string;
  updatedImagesTitle: string;
  updatedImages: ImageItem[];
  locationTitle: string;
  locationTitleText: string;
  locationArea: string;
  number1: string;
  number2: string;
  email1: string;
  email2: string;
  mapIframeUrl: string;
  cardImage: string;
  cardImageFile?: File;
  cardImagePreview?: string;
  cardLocation: string;
  cardAreaFt: string;
  cardProjectType: ProjectType;
  cardHouse: HouseStatus;
  reraNumber: string;
};

const ProjectAdminForm = () => {
  // Current section state (1-4)
  const [currentSection, setCurrentSection] = useState(1);
  
  // Track completed sections
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    projectTitle: '',
    slug: '',
    projectState: 'on-going',
    projectType: 'residential',
    shortAddress: '',
    projectStatusPercentage: 0,
    bannerSection: {
      desktopBannerImage: '',
      mobileBannerImage: '',
      alt: '',
    },
    aboutUsDetail: {
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      image: {
        url: '',
        alt: '',
      },
    },
    floorPlans: [
      {
        id: Date.now().toString(),
        title: '',
        image: '',
        alt: '',
      },
    ],
    projectImages: [
      { id: Date.now().toString() + '_1', image: '', alt: '' },
      { id: Date.now().toString() + '_2', image: '', alt: '' },
      { id: Date.now().toString() + '_3', image: '', alt: '' },
      { id: Date.now().toString() + '_4', image: '', alt: '' },
      { id: Date.now().toString() + '_5', image: '', alt: '' },
    ],
    amenities: [
      {
        id: Date.now().toString() + '_1',
        title: '',
        svgOrImage: '',
        alt: '',
      },

    ],
    youtubeUrl: '',
    updatedImagesTitle: '',
    updatedImages: [
      { id: Date.now().toString() + '_u1', image: '', alt: '' },
      { id: Date.now().toString() + '_u2', image: '', alt: '' },
      { id: Date.now().toString() + '_u3', image: '', alt: '' },
    
    ],
    locationTitle: '',
    locationTitleText: '',
    locationArea: '',
    number1: '9898211567',
    number2: '9898508567',
    email1: '',
    email2: '',
    mapIframeUrl: '',
    cardImage: '',
    cardLocation: '',
    cardAreaFt: '',
    cardProjectType: 'residential',
    cardHouse: 'Ready to Move',
    reraNumber: '',
  });
  console.log('🚀 Form initialization:', formData);
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Reset form to initial state
  const resetForm = () => {
    const resetFormData: FormData = {
      projectTitle: '',
      slug: '',
      projectState: 'on-going',
      projectType: 'residential',
      shortAddress: '',
      projectStatusPercentage: 0,
      bannerSection: {
        desktopBannerImage: '',
        mobileBannerImage: '',
        alt: '',
      },
      aboutUsDetail: {
        description1: '',
        description2: '',
        description3: '',
        description4: '',
        image: {
          url: '',
          alt: '',
        },
      },
      floorPlans: [
        {
          id: Date.now().toString(),
          title: '',
          image: '',
          alt: '',
        },
      ],
      projectImages: [
        { id: Date.now().toString() + '_1', image: '', alt: '' },
        { id: Date.now().toString() + '_2', image: '', alt: '' },
        { id: Date.now().toString() + '_3', image: '', alt: '' },
        { id: Date.now().toString() + '_4', image: '', alt: '' },
        { id: Date.now().toString() + '_5', image: '', alt: '' },
      ],
      amenities: [
        {
          id: Date.now().toString() + '_1',
          title: '',
          svgOrImage: '',
          alt: '',
        },

      ],
      youtubeUrl: '',
      updatedImagesTitle: '',
      updatedImages: [
        { id: Date.now().toString() + '_u1', image: '', alt: '' },
        { id: Date.now().toString() + '_u2', image: '', alt: '' },
        { id: Date.now().toString() + '_u3', image: '', alt: '' },

      ],
      locationTitle: '',
      locationTitleText: '',
      locationArea: '',
      number1: '9898211567',
      number2: '9898508567',
      email1: '',
      email2: '',
      mapIframeUrl: '',
      cardImage: '',
      cardLocation: '',
      cardAreaFt: '',
      cardProjectType: 'residential',
      cardHouse: 'Ready to Move',
      reraNumber: '',
    };
    
    setFormData(resetFormData);
    setCurrentSection(1);
    setCompletedSections(new Set());
    setValidationErrors({});
    localStorage.removeItem('project-form-data');
    console.log('✅ Form reset to initial state');
  };

  // Helper functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate slug when title changes
      if (name === 'projectTitle') {
        newData.slug = generateSlug(value);
      }
      
      // Auto-sync card project type with main project type
      if (name === 'projectType') {
        newData.cardProjectType = value as ProjectType;
      }
      
      return newData;
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // About Us handlers
  const handleAboutUsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        // Handle nested image.alt field
        ...(field === 'imageAlt' ? {
          image: {
            ...prev.aboutUsDetail.image,
            alt: value,
          },
        } : {
          [field]: value,
        }),
      },
    }));
  };

  const handleAboutUsImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        image: {
          ...prev.aboutUsDetail.image,
          file,
          preview,
        },
      },
    }));
  };

  const removeAboutUsImage = () => {
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        image: {
          ...prev.aboutUsDetail.image,
          file: undefined,
          preview: undefined,
        },
      },
    }));
  };

  // Banner Section handlers
  const handleBannerUpload = (type: 'desktop' | 'mobile', file: File) => {
    const preview = URL.createObjectURL(file);
    const fieldName = type === 'desktop' ? 'desktopBannerFile' : 'mobileBannerFile';
    const previewName = type === 'desktop' ? 'desktopPreview' : 'mobilePreview';
    
    setFormData(prev => ({
      ...prev,
      bannerSection: {
        ...prev.bannerSection,
        [fieldName]: file,
        [previewName]: preview,
      },
    }));
  };

  const removeBannerImage = (type: 'desktop' | 'mobile') => {
    const fieldName = type === 'desktop' ? 'desktopBannerFile' : 'mobileBannerFile';
    const previewName = type === 'desktop' ? 'desktopPreview' : 'mobilePreview';
    
    setFormData(prev => ({
      ...prev,
      bannerSection: {
        ...prev.bannerSection,
        [fieldName]: undefined,
        [previewName]: undefined,
      },
    }));
  };

  const handleBannerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bannerSection: {
        ...prev.bannerSection,
        [field]: value,
      },
    }));
  };

  // Floor Plans handlers
  const addFloorPlan = () => {
    setFormData(prev => ({
      ...prev,
      floorPlans: [...prev.floorPlans, { id: Date.now().toString(), title: '', image: '', alt: '' }],
    }));
  };

  const removeFloorPlan = (id: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.filter(fp => fp.id !== id),
    }));
  };

  const updateFloorPlanField = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => (fp.id === id ? { ...fp, [field]: value } : fp)),
    }));
  };

  const updateFloorPlanImage = (id: string, file: File, preview: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => fp.id === id ? { ...fp, file, preview } : fp),
    }));
  };

  // Project Images handlers

  const removeProjectImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.filter(img => img.id !== id),
    }));
  };

  const updateProjectImageField = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const updateProjectImageFile = (id: string, file: File, preview: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => img.id === id ? { ...img, file, preview } : img),
    }));
  };

  // Amenities handlers
  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, { id: Date.now().toString(), title: '', svgOrImage: '', alt: '' }],
    }));
  };

  const removeAmenity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(am => am.id !== id),
    }));
  };

  const updateAmenityField = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => (am.id === id ? { ...am, [field]: value } : am)),
    }));
  };

  const updateAmenityFile = (id: string, file: File, preview: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => am.id === id ? { ...am, file, preview } : am),
    }));
  };

  // Updated Images handlers
  const updateUpdatedImageField = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const updateUpdatedImageFile = (id: string, file: File, preview: string) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => img.id === id ? { ...img, file, preview } : img),
    }));
  };

  // Card image upload handler
  const handleFileUpload = (file: File, fieldName: string) => {
    if (fieldName === 'brochureFile') {
      // Check for PDF file type and 100MB size limit
      if (!file.type.includes('pdf')) {
        setToastMessage('Please upload a PDF file');
        setToastType('error');
        setShowToast(true);
        return;
      }
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        setToastMessage('Brochure file size must be less than 100MB');
        setToastType('error');
        setShowToast(true);
        return;
      }
    }
    
    if (fieldName === 'cardImage') {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        cardImageFile: file,
        cardImagePreview: preview,
      }));
    } else if (fieldName === 'brochureFile') {
      setFormData(prev => ({
        ...prev,
        brochureFile: file,
      }));
    }
  };

  const removeUploadedFile = (fieldName: string) => {
    if (fieldName === 'cardImage') {
      setFormData(prev => ({
        ...prev,
        cardImageFile: undefined,
        cardImagePreview: undefined,
      }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 All sections complete:', allSectionsComplete);
    console.log('📝 Form data:', formData);
    
    if (!allSectionsComplete) {
      console.log('❌ Form submission blocked - incomplete sections');
      setToastMessage('Please complete all sections before submitting! ⚠️');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('❌ Form submission already in progress');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📦 Building form data...');
      const formDataToSend = new FormData();

      // Append basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          // Handle youtubeUrl specially to pass null if empty
          if (key === 'youtubeUrl') {
            formDataToSend.append(key, value.toString().trim() || 'null');
          } 
          // Handle reraNumber specially to pass null if empty
          else if (key === 'reraNumber') {
            formDataToSend.append(key, value.toString().trim() || 'null');
          }
          else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      // Add individual description fields as expected by the server
      formDataToSend.append('description1', formData.aboutUsDetail.description1);
      formDataToSend.append('description2', formData.aboutUsDetail.description2 || '');
      formDataToSend.append('description3', formData.aboutUsDetail.description3 || '');
      formDataToSend.append('description4', formData.aboutUsDetail.description4 || '');
      
      console.log('📝 Description fields being sent:');
      console.log('description1:', formData.aboutUsDetail.description1);
      console.log('description2:', formData.aboutUsDetail.description2 || '');
      console.log('description3:', formData.aboutUsDetail.description3 || '');
      console.log('description4:', formData.aboutUsDetail.description4 || '');

      // Add aboutUs image alt text separately
      formDataToSend.append('aboutUsAlt', formData.aboutUsDetail.image.alt);

      // Handle files and complex objects
      if (formData.brochureFile) {
        console.log('📄 Adding brochure file:', formData.brochureFile.name);
        formDataToSend.append('brochure', formData.brochureFile);
      }
      
      if (formData.aboutUsDetail.image.file) {
        console.log('🖼️ Adding about us image file:', formData.aboutUsDetail.image.file.name);
        formDataToSend.append('aboutUsImage', formData.aboutUsDetail.image.file);
      }
      
      if (formData.cardImageFile) {
        console.log('🖼️ Adding card image file:', formData.cardImageFile.name);
        formDataToSend.append('cardImage', formData.cardImageFile);
      }

      // Send floor plan files and data
      formDataToSend.append('floorPlans', JSON.stringify(formData.floorPlans));
      formData.floorPlans.forEach((floorPlan) => {
        if (floorPlan.file) {
          formDataToSend.append(`floorPlanImages`, floorPlan.file);
        }
      });
      
      // Send project image files and data
      formDataToSend.append('projectImages', JSON.stringify(formData.projectImages));
      formData.projectImages.forEach((image) => {
        if (image.file) {
          formDataToSend.append(`projectImageFiles`, image.file);
        }
      });
      
      // Process amenities to only include complete ones and null if none
      const validAmenities = formData.amenities.filter(amenity => 
        amenity.title.trim() && amenity.file && amenity.alt.trim()
      );
      console.log('🏠 Valid amenities:', validAmenities);
      formDataToSend.append('amenities', JSON.stringify(validAmenities.length > 0 ? validAmenities : null));
      
      // Send amenity files
      validAmenities.forEach((amenity) => {
        if (amenity.file) {
          formDataToSend.append(`amenityFiles`, amenity.file);
        }
      });
      
      // Send updated image files and data
      formDataToSend.append('updatedImages', JSON.stringify(formData.updatedImages));
      formData.updatedImages.forEach((image) => {
        if (image.file) {
          formDataToSend.append(`updatedImageFiles`, image.file);
        }
      });

      console.log('📡 Sending request to API...');
      console.log('📦 FormData contents:');
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await projectApi.createProject(formDataToSend);
      console.log('✅ API Response:', response);

      if (response.success) {
        setSuccessMessage(`Project "${formData.projectTitle}" created successfully!`);
        setShowSuccessModal(true);
        setToastMessage('Project created successfully! 🎉');
        setToastType('success');
        setShowToast(true);
        
        // Reset entire form after successful creation
        resetForm();
        
        console.log('✅ Form cleared after successful project creation');
      } else {
        // Handle API error response
        console.error('❌ API returned error:', response.message);
        setToastMessage(response.message || 'Error creating project! ❌');
        setToastType('error');
        setShowToast(true);
        if (response.errors && Array.isArray(response.errors)) {
          // Convert validation errors array to Record format
          const errorRecord: Record<string, string> = {};
          response.errors.forEach((error: { path?: string; msg?: string }) => {
            if (error.path && error.msg) {
              errorRecord[error.path] = error.msg;
            }
          });
          setValidationErrors(errorRecord);
        }
      }

    } catch (error: unknown) {
      console.error('❌ Error creating project:', error);
      console.log('📋 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: error && typeof error === 'object' && 'response' in error ? error.response : null
      });
      setToastMessage('Error creating project! ❌');
      setToastType('error');
      setShowToast(true);
      setValidationErrors({});
    } finally {
      // Reset loading state regardless of success or error
      setIsSubmitting(false);
      console.log('🔄 Form submission completed - loading state reset');
    }
  };

  // Navigation functions
  const goToNextSection = () => {
    // Check if current section is valid before allowing navigation
    const isCurrentSectionValid = completedSections.has(currentSection);
    
    console.log('🔄 Navigation attempt:', {
      currentSection,
      isCurrentSectionValid,
      completedSections: Array.from(completedSections)
    });
    
    if (!isCurrentSectionValid) {
      setToastMessage(`Please complete Section ${currentSection} before proceeding! ⚠️`);
      setToastType('warning');
      setShowToast(true);
      return;
    }
    
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionChange = (section: number) => {
    // Only allow navigation to completed sections or the next immediate section
    if (section <= currentSection || completedSections.has(section - 1)) {
      setCurrentSection(section);
    } else {
      setToastMessage(`Please complete the previous sections first! ⚠️`);
      setToastType('warning');
      setShowToast(true);
    }
  };

  // Auto-validate sections and mark as completed
  useEffect(() => {
    // Section validation functions with detailed error reporting
    const validateSection1 = () => {
      const errors: string[] = [];
      
      console.log('🔍 Section 1 validation check:', {
        projectTitle: formData.projectTitle?.trim() || 'EMPTY',
        slug: formData.slug?.trim() || 'EMPTY',
        shortAddress: formData.shortAddress?.trim() || 'EMPTY',
        brochureFile: formData.brochureFile ? 'FILE_EXISTS' : 'NO_FILE',
        description1: formData.aboutUsDetail.description1?.trim() || 'EMPTY',
        aboutUsImage: formData.aboutUsDetail.image.file ? 'FILE_EXISTS' : 'NO_FILE'
      });
      
      if (!formData.projectTitle.trim()) errors.push('Project title required');
      if (!formData.slug.trim()) errors.push('Slug required');
      if (!formData.shortAddress.trim()) {
        errors.push('Short address required');
      } else if (formData.shortAddress.trim().length < 2) {
        errors.push('Short address must be at least 2 characters');
      }
      if (!formData.brochureFile) errors.push('Brochure file required');
      if (!formData.aboutUsDetail.description1.trim()) errors.push('Description 1 required');
      // Description 2, 3, 4 are now optional - removed validation
      if (!formData.aboutUsDetail.image.file) errors.push('About us image required');
      
      // Store validation errors for display
      if (currentSection === 1 && errors.length > 0) {
        console.log('❌ Section 1 validation errors:', errors);
      } else if (currentSection === 1) {
        console.log('✅ Section 1 validation passed!');
      }
      
      return errors.length === 0;
    };

    const validateSection2 = () => {
      const errors: string[] = [];
      
      // Floor plans are optional, but if provided, must have title and alt
      const incompleteFloorPlans = formData.floorPlans.filter(fp => 
        (fp.title.trim() || fp.file || fp.alt.trim()) && // Has some content
        (!fp.title.trim() || !fp.file || !fp.alt.trim()) // But missing required fields
      );
      if (incompleteFloorPlans.length > 0) {
        errors.push('Floor plans must have title, image, and alt text when provided');
      }
      
      // Project images - exactly 5 mandatory with alt text
      if (formData.projectImages.length !== 5) {
        errors.push('Exactly 5 project images are required');
      } else {
        const incompleteProjectImages = formData.projectImages.filter(img => 
          !img.alt.trim() || !img.file
        );
        if (incompleteProjectImages.length > 0) {
          errors.push('All project images must have image file and alt text');
        }
      }
      
      // Store validation errors for display
      if (currentSection === 2 && errors.length > 0) {
        console.log('❌ Section 2 validation errors:', errors);
      }
      
      return errors.length === 0;
    };

    const validateSection3 = () => {
      const errors: string[] = [];
      
      // Amenities are optional, but if provided, must have title and alt
      const incompleteAmenities = formData.amenities.filter(amenity => 
        (amenity.title.trim() || amenity.file || amenity.alt.trim()) && // Has some content
        (!amenity.title.trim() || !amenity.file || !amenity.alt.trim()) // But missing required fields
      );
      if (incompleteAmenities.length > 0) {
        errors.push('Amenities must have title, image, and alt text when provided');
      }
      
      // Updated images title is mandatory
      if (!formData.updatedImagesTitle.trim()) {
        errors.push('Updated images title is required');
      }
      
      // Updated images - exactly 3 mandatory with alt text
      if (formData.updatedImages.length !== 3) {
        errors.push('Exactly 3 updated images are required');
      } else {
        const incompleteUpdatedImages = formData.updatedImages.filter(img => 
          !img.alt.trim() || !img.file
        );
        if (incompleteUpdatedImages.length > 0) {
          errors.push('All updated images must have image file and alt text');
        }
      }
      
      // Store validation errors for display
      if (currentSection === 3 && errors.length > 0) {
        console.log('❌ Section 3 validation errors:', errors);
      }
      
      return errors.length === 0;
    };

    const validateSection4 = () => {
      const errors: string[] = [];
      
      // Location section - all fields mandatory
      if (!formData.locationTitle.trim()) errors.push('Location title required');
      if (!formData.locationTitleText.trim()) errors.push('Location title text required');
      if (!formData.mapIframeUrl.trim()) errors.push('Map iframe URL required');
      
      // Card detail section - all fields mandatory  
      if (!formData.cardLocation.trim()) errors.push('Card location required');
      if (!formData.cardAreaFt.trim()) errors.push('Card area (sq ft) required');
      
      // RERA details - optional (handled by passing null if empty)
      
      // Store validation errors for display
      if (currentSection === 4 && errors.length > 0) {
        console.log('❌ Section 4 validation errors:', errors);
      }
      
      return errors.length === 0;
    };
    
    const newCompletedSections = new Set<number>();
    
    const section1Valid = validateSection1();
    const section2Valid = validateSection2();
    const section3Valid = validateSection3();
    const section4Valid = validateSection4();
    
    console.log('🔍 Section validation status:', {
      section1: section1Valid,
      section2: section2Valid,
      section3: section3Valid,
      section4: section4Valid,
    });
    
    if (section1Valid) newCompletedSections.add(1);
    if (section2Valid) newCompletedSections.add(2);
    if (section3Valid) newCompletedSections.add(3);
    if (section4Valid) newCompletedSections.add(4);
    
    setCompletedSections(newCompletedSections);
  }, [formData, currentSection]);

  // Save form data to localStorage on changes
  useEffect(() => {
    const dataToSave = {
      ...formData,
      // Don't save files to localStorage
      brochureFile: undefined,
      cardImageFile: undefined,
      aboutUsDetail: {
        ...formData.aboutUsDetail,
        image: {
          ...formData.aboutUsDetail.image,
          file: undefined,
        },
      },
      floorPlans: formData.floorPlans.map(fp => ({
        ...fp,
        file: undefined,
      })),
      projectImages: formData.projectImages.map(img => ({
        ...img,
        file: undefined,
      })),
      amenities: formData.amenities.map(amenity => ({
        ...amenity,
        file: undefined,
      })),
      updatedImages: formData.updatedImages.map(img => ({
        ...img,
        file: undefined,
      })),
    };
    localStorage.setItem('project-form-data', JSON.stringify(dataToSave));
  }, [formData]);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('project-form-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Check if all sections are complete
  const allSectionsComplete = completedSections.size === 4;
  
  // Debug log for allSectionsComplete
  useEffect(() => {
    console.log('🏁 All sections complete status:', allSectionsComplete);
    console.log('📊 Completed sections count:', completedSections.size);
    console.log('✅ Completed sections list:', Array.from(completedSections));
  }, [allSectionsComplete, completedSections]);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Suspense fallback={<SectionLoading />}>
            <ProjectSection1
              formData={{
                projectTitle: formData.projectTitle,
                slug: formData.slug,
                brochureFile: formData.brochureFile,
                projectState: formData.projectState,
                projectType: formData.projectType,
                shortAddress: formData.shortAddress,
                projectStatusPercentage: formData.projectStatusPercentage,
                bannerSection: formData.bannerSection,
                aboutUsDetail: formData.aboutUsDetail,
              }}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              handleAboutUsChange={handleAboutUsChange}
              handleAboutUsImageUpload={handleAboutUsImageUpload}
              removeAboutUsImage={removeAboutUsImage}
              handleBrochureUpload={(file: File) => handleFileUpload(file, 'brochureFile')}
              handleBannerUpload={handleBannerUpload}
              removeBannerImage={removeBannerImage}
              handleBannerChange={handleBannerChange}
            />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<SectionLoading />}>
            <ProjectSection2
              formData={{
                floorPlans: formData.floorPlans,
                projectImages: formData.projectImages,
              }}
              addFloorPlan={addFloorPlan}
              removeFloorPlan={removeFloorPlan}
              updateFloorPlanField={updateFloorPlanField}
              updateFloorPlanImage={updateFloorPlanImage}
              removeProjectImage={removeProjectImage}
              updateProjectImageField={updateProjectImageField}
              updateProjectImageFile={updateProjectImageFile}
            />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<SectionLoading />}>
            <ProjectSection3
              formData={{
                amenities: formData.amenities,
                youtubeUrl: formData.youtubeUrl,
                updatedImagesTitle: formData.updatedImagesTitle,
                updatedImages: formData.updatedImages,
              }}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              addAmenity={addAmenity}
              removeAmenity={removeAmenity}
              updateAmenityField={updateAmenityField}
              updateAmenityFile={updateAmenityFile}
              updateUpdatedImageField={updateUpdatedImageField}
              updateUpdatedImageFile={updateUpdatedImageFile}
            />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<SectionLoading />}>
            <ProjectSection4
              formData={{
                locationTitle: formData.locationTitle,
                locationTitleText: formData.locationTitleText,
                locationArea: formData.locationArea,
                number1: formData.number1,
                number2: formData.number2,
                email1: formData.email1,
                email2: formData.email2,
                mapIframeUrl: formData.mapIframeUrl,
                cardImage: formData.cardImage,
                cardImageFile: formData.cardImageFile,
                cardImagePreview: formData.cardImagePreview,
                cardLocation: formData.cardLocation,
                cardAreaFt: formData.cardAreaFt,
                cardProjectType: formData.cardProjectType,
                cardHouse: formData.cardHouse,
                reraNumber: formData.reraNumber,
              }}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              handleFileUpload={handleFileUpload}
              removeUploadedFile={removeUploadedFile}
              validateEmail={validateEmail}
            />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating Project...</h3>
            <p className="text-sm text-gray-600">Please wait while we save your project</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200 mb-8">
          <div className="bg-linear-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
            <p className="text-blue-100 mt-2">Complete all 4 sections to create your project</p>
          </div>
        </div>

        {/* Section Navigator */}
        <SectionNavigator
          currentSection={currentSection}
          completedSections={completedSections}
          onSectionChange={handleSectionChange}
          isDisabled={isSubmitting}
        />

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {/* Current Section Content */}
          <div className="mb-8">
            {renderCurrentSection()}
          </div>

          {/* Navigation Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={currentSection === 1 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  currentSection === 1 || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              <div className="flex items-center space-x-4">
                {currentSection < 4 ? (
                  <button
                    type="button"
                    onClick={goToNextSection}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      completedSections.has(currentSection) && !isSubmitting
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    disabled={!completedSections.has(currentSection) || isSubmitting}
                  >
                    {isSubmitting 
                      ? 'Please wait...' 
                      : completedSections.has(currentSection) ? 'Next' : 'Complete Section First'
                    }
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!allSectionsComplete || isSubmitting}
                    className={`flex items-center gap-2 px-8 py-4 font-bold text-lg rounded-xl transition-all shadow-xl ${
                      allSectionsComplete && !isSubmitting
                        ? 'bg-linear-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 hover:shadow-2xl transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Creating Project...
                      </>
                    ) : (
                      <>
                        <Save size={24} />
                        {allSectionsComplete ? 'Create Project' : 'Complete All Sections'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Section {currentSection} of 4</span>
                <span>{completedSections.size} sections completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-linear-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentSection / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Project Created Successfully! 🎉"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
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
};

export default ProjectAdminForm;